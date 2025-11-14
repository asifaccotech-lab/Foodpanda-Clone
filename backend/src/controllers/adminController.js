import Joi from 'joi';
import { Order, OrderItem, User, Restaurant } from '../models/index.js';

const statusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled').required()
});

export async function listAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem },
        { model: Restaurant },
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { value, error } = statusSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = value.status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}