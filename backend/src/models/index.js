import { sequelize } from '../config/database.js';

import { User } from './user.js';
import { Address } from './address.js';
import { Restaurant } from './restaurant.js';
import { Category } from './category.js';
import { MenuItem } from './menuItem.js';
import { Cart } from './cart.js';
import { CartItem } from './cartItem.js';
import { Order } from './order.js';
import { OrderItem } from './orderItem.js';

// Associations
User.hasMany(Address, { foreignKey: 'userId', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Category.hasMany(MenuItem, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

MenuItem.hasMany(CartItem, { foreignKey: 'menuItemId', onDelete: 'CASCADE' });
CartItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId', onDelete: 'CASCADE' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

export async function syncModels() {
  await sequelize.sync({ alter: true });
  console.log('Models synced');
}

export {
  sequelize,
  User,
  Address,
  Restaurant,
  Category,
  MenuItem,
  Cart,
  CartItem,
  Order,
  OrderItem
};