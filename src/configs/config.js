const { DB_DEV, DB_PROD } = require('./environments');

const development = {
  username: DB_DEV.USER,
  password: DB_DEV.PASS,
  database: DB_DEV.NAME,
  host: DB_DEV.HOST,
  dialect: DB_DEV.DRIVER,
};

const production = {
  username: DB_PROD.USER,
  password: DB_PROD.PASS,
  database: DB_PROD.NAME,
  host: DB_PROD.HOST,
  dialect: DB_PROD.DRIVER,
};

module.exports = {
  development,
  production,
};
