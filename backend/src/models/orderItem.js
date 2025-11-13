import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  menuItemId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'order_items',
  timestamps: true
});