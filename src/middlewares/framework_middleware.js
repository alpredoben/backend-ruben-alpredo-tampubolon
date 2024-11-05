const cors = require('cors');
const compression = require('compression');
const { APP } = require('../configs/environments');
const { logger } = require('../utils/logger');
const { translator } = require('../lang');
const { filterAndCleanObject } = require('../utils/helper');

module.exports = {
  // Cors
  corsMiddleware: () =>
    cors({
      origin: '*', // Set the allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      optionsSuccessStatus: 204,
    }),

  // Compression
  compressionMiddleware: () =>
    compression({
      level: 6,
      threshold: 1024, // Only compress if response size > 1KB
    }),

  // Logger
  loggerMiddleware: (req, res, next) => {
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
      status: res.statusCode,
    });
    next();
  },

  // XSS Filter
  xssFilterMiddleware: (req, res, next) => {
    if (req.body) req.body = filterAndCleanObject(req.body);
    if (req.query) req.query = filterAndCleanObject(req.query);
    if (req.params) req.params = filterAndCleanObject(req.params);
    next();
  },

  // Header Lang
  headerLangMiddleware: async (req, res, next) => {
    if (req?.headers?.lang) {
      translator.setLocale(req.headers.lang);
    } else {
      translator.setLocale(APP.LANG ?? 'en');
      req.headers.lang = APP.LANG ?? 'en';
    }

    next();
  },
};
