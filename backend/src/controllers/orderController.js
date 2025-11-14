import Joi from 'joi';
import { sequelize, Cart, CartItem, MenuItem, Order, OrderItem } from '../models/index.js';

const createOrderSchema = Joi.object({
  addressId: Joi.number().integer().optional()
});

// Simple ETA estimate by status
function estimateEtaMinutes(status) {
  switch (status) {
    case 'pending': return 45;
    case 'confirmed': return 40;
    case 'preparing': return 30;
    case 'out_for_delivery': return 10;
    case 'delivered': return 0;
    default: return 45;
  }
}

function generateTrackingCode(orderId) {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FD-${orderId}-${rnd}`;
}

export async function createOrder(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { value, error } = createOrderSchema.validate(req.body);
    if (error) {
      await t.rollback();
      return res.status(400).json({ error: error.message });
    }

    const cart = await Cart.findOne({ where: { userId: req.user.id }, transaction: t });
    if (!cart) {
      await t.rollback();
      return res.status(400).json({ error: 'Cart not found' });
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: MenuItem }],
      transaction: t
    });

    if (!cartItems.length) {
      await t.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Ensure all items are from the same restaurant
    const restaurantIds = new Set(cartItems.map(ci => ci.MenuItem?.restaurantId));
    if (restaurantIds.size !== 1) {
      await t.rollback();
      return res.status(400).json({ error: 'All items must be from the same restaurant' });
    }
    const restaurantId = [...restaurantIds][0];

    // Calculate total
    const total = cartItems.reduce((sum, ci) => {
      const price = Number(ci.MenuItem?.price || 0);
      return sum + price * ci.quantity;
    }, 0);

    const order = await Order.create({
      userId: req.user.id,
      restaurantId,
      totalPrice: Number(total.toFixed(2)),
      status: 'pending'
    }, { transaction: t });

    const trackingCode = generateTrackingCode(order.id);
    order.trackingCode = trackingCode;
    await order.save({ transaction: t });

    // Create order items
    for (const ci of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        menuItemId: ci.menuItemId,
        quantity: ci.quantity,
        unitPrice: ci.MenuItem?.price
      }, { transaction: t });
    }

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();
    res.status(201).json({ id: order.id, status: order.status, totalPrice: order.totalPrice, trackingCode: order.trackingCode });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem }],
    });
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrderTracking(req, res, next) {
  try {
    const id = Number(req.params.id);
    const order = await Order.findByPk(id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const etaMinutes = estimateEtaMinutes(order.status);
    res.json({ status: order.status, etaMinutes, trackingCode: order.trackingCode });
  } catch (err) {
    next(err);
  }
}