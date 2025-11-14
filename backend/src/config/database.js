import { Sequelize } from 'sequelize';

const {
  DATABASE_URL,
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASS = '',
  DB_NAME = 'foodapp',
  NODE_ENV = 'development'
} = process.env;

let sequelize;

if (DATABASE_URL) {
  // Cloud providers usually require SSL
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: NODE_ENV === 'development' ? console.log : false
  });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: 'postgres',
    logging: NODE_ENV === 'development' ? console.log : false
  });
}

export { sequelize };

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    throw err;
  }
}