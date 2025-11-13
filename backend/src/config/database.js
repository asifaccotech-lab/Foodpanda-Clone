import { Sequelize } from 'sequelize';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASS = '',
  DB_NAME = 'foodapp',
  NODE_ENV = 'development'
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? console.log : false
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    throw err;
  }
}