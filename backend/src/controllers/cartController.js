import Joi from 'joi';
import { Cart, CartItem, MenuItem } from '../models/index.js';

const addSchema = Joi.object({
  menuItemId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).max(99).default(1)
});

const updateSchema = Joi.object({
  quantity: Joi.number().integer().min(0).max(99).required()
});

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
}

async function serializeCart(cartId) {
  const items = await CartItem.findAll({
    where: { cartId },
    include: [{ model: MenuItem }]
  });
  const result = items.map((ci) => ({
    id: ci.id,
    menuItemId: ci.menuItemId,
    name: ci.MenuItem?.name,
    quantity: ci.quantity,
    unitPrice: Number(ci.MenuItem?.price || 0),
    lineTotal: Number(ci.quantity) * Number(ci.MenuItem?.price || 0)
  }));
  const total = result.reduce((sum, it) => sum + it.lineTotal, 0);
  return { items: result, total: Number(total.toFixed(2)) };
}

export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const payload = await serializeCart(cart.id);
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { value, error } = addSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const cart = await getOrCreateCart(req.user.id);
    const menuItem = await MenuItem.findByPk(value.menuItemId);
    if (!menuItem || !menuItem.isAvailable) return res.status(404).json({ error: 'Item not available' });

    const existing = await CartItem.findOne({ where: { cartId: cart.id, menuItemId: value.menuItemId } });
    if (existing) {
      existing.quantity += value.quantity;
      await existing.save();
    } else {
      await CartItem.create({ cartId: cart.id, menuItemId: value.menuItemId, quantity: value.quantity });
    }

    const payload = await serializeCart(cart.id);
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { value, error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const itemId = Number(req.params.id);
    const item = await CartItem.findByPk(itemId, { include: [{ model: Cart }] });
    if (!item || item.Cart.userId !== req.user.id) return res.status(404).json({ error: 'Item not found' });

    if (value.quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = value.quantity;
      await item.save();
    }

    const payload = await serializeCart(item.cartId);
    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function deleteCartItem(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const item = await CartItem.findByPk(itemId, { include: [{ model: Cart }] });
    if (!item || item.Cart.userId !== req.user.id) return res.status(404).json({ error: 'Item not found' });

    const cartId = item.cartId;
    await item.destroy();
    const payload = await serializeCart(cartId);
    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
}