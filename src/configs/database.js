const { Sequelize } = require('sequelize');
const cfgDB = require('./config');
const { APP, DB_DEV, DB_PROD } = require('./environments');

const dbProp = {
  development: {
    username: DB_DEV.USER,
    password: DB_DEV.PASS,
    database: DB_DEV.NAME,
    host: DB_DEV.USER,
    dialect: DB_DEV.DRIVER,
  },
  production: {
    username: DB_PROD.USER,
    password: DB_PROD.PASS,
    database: DB_PROD.NAME,
    host: DB_PROD.USER,
    dialect: DB_PROD.DRIVER,
  },
};

const cfg = cfgDB[`${APP.ENV.toString().toLowerCase()}`];

const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
  host: cfg.host,
  port: cfg.port || 3306,
  dialect: cfg.dialect,
  pool: {
    max: 10, // Maximum number of connections
    min: 0, // Minimum number of connections
    acquire: 30000, // Maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000, // Maximum time, in milliseconds, that a connection can remain idle before being released
  },
  logging:
    APP.ENV.toString().toLowerCase() === 'development' ? console.log : false, // Disable logging in production
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
}

module.exports = { sequelize, testConnection };
