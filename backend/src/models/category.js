import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false, unique: true }
}, {
  tableName: 'categories',
  timestamps: true
});