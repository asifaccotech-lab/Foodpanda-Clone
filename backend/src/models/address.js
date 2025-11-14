import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  street: { type: DataTypes.STRING(200), allowNull: false },
  city: { type: DataTypes.STRING(120), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: true },
  zip: { type: DataTypes.STRING(30), allowNull: true },
  lat: { type: DataTypes.FLOAT, allowNull: true },
  lng: { type: DataTypes.FLOAT, allowNull: true }
}, {
  tableName: 'addresses',
  timestamps: true
});