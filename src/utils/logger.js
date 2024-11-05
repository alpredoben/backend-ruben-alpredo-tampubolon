const { createLogger, format, transports } = require('winston');

const { combine, colorize, json, timestamp } = format;
const { APP } = require('../configs/environments');

const envName = APP.ENV.toString().toLowerCase();
const logFormat = format.printf(
  ({ level, message, timestamp: timestamptz }) =>
    `${timestamptz} [${level}]: ${message}`
);

module.exports = {
  logger: createLogger({
    level: envName === 'production' ? 'info' : 'debug',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      envName === 'production' ? json() : colorize(),
      logFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new transports.File({
        filename: 'logs/combined.log',
      }),
    ],
  }),
};
