import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Restaurant = sequelize.define('Restaurant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(160), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  imageUrl: { type: DataTypes.STRING(400), allowNull: true },
  rating: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 4.5 },
  deliveryFee: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 }
}, {
  tableName: 'restaurants',
  timestamps: true
});