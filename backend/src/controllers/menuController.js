import { MenuItem, Restaurant, Category } from '../models/index.js';

export async function getMenuForRestaurant(req, res, next) {
  try {
    const restaurantId = Number(req.params.id);
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const items = await MenuItem.findAll({
      where: { restaurantId },
      include: [{ model: Category }],
      order: [['name', 'ASC']]
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
}