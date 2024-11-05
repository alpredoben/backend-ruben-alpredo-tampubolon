require('dotenv').config();

module.exports = {
  APP: {
    NAME: process.env.APP_NAME || 'express-app',
    PORT: process.env.APP_PORT || 7701,
    DEBUG: process.env.APP_DEBUG || true,
    ENV: process.env.APP_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL,
    LANG: process.env.APP_LANG || 'en',
    LIMIT_JSON: process.env.APP_LIMIT_JSON,
  },
  DB_DEV: {
    DRIVER: process.env.DB_DRIVER,
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_USER,
    PASS: process.env.DB_PASS,
    NAME: process.env.DB_NAME,
  },
  DB_PROD: {
    DRIVER: process.env.DB_DRIVER_PROD,
    HOST: process.env.DB_HOST_PROD,
    PORT: process.env.DB_PORT_PROD,
    USER: process.env.DB_USER_PROD,
    PASS: process.env.DB_PASS_PROD,
    NAME: process.env.DB_NAME_PROD,
  },
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET_KEY || 'myD3faul7S3c12e7',
    REFRESH_KEY: process.env.JWT_REFRESH_KEY || 'refreshKEy',
  },
  LIMITTER: {
    RETRY: process.env.LIMIT_RETRY,
    RATE_MAX: process.env.LIMIT_RATE_MAX,
  },
};
