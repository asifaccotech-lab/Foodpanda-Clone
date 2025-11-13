import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(120), allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'admin'), defaultValue: 'customer', allowNull: false }
}, {
  tableName: 'users',
  timestamps: true
});