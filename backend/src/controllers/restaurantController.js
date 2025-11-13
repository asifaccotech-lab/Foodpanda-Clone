import { Op } from 'sequelize';
import { Restaurant, MenuItem } from '../models/index.js';

export async function listRestaurants(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 12);
    const search = (req.query.search || '').trim();

    const where = search ? { name: { [Op.iLike]: `%${search}%` } } : {};
    const { rows, count } = await Restaurant.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['rating', 'DESC']]
    });

    res.json({
      items: rows,
      page,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count
    });
  } catch (err) {
    next(err);
  }
}

export async function getRestaurantById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const restaurant = await Restaurant.findByPk(id, {
      include: [{ model: MenuItem }]
    });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    res.json(restaurant);
  } catch (err) {
    next(err);
  }
}