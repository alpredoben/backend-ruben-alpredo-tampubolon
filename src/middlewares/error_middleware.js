/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const httpStatus = require('http-status');
const { APP } = require('../configs/environments');
const { logger } = require('../utils/logger');
const { getFormatDate } = require('../utils/helper');
const { getErrorResponse } = require('../utils/responser');
const { translator } = require('../lang');

class ExpressCustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  ExpressCustomError,

  // Express Not Found Handler
  errorNotFoundHandlerMiddleware: (req, res, next) => {
    const msg = `${translator.__('message.error.route.not_found', { path: req.url })}`;
    next(new ExpressCustomError(msg, httpStatus.status.NOT_FOUND));
  },

  // Express Remove Favicon Handler
  removeFaviconHandlerMiddleware: (req, res, next) => {
    if (req.url === '/favicon.ico') {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      res.end();
    } else {
      next();
    }
  },

  // Express Handler Middleware
  errorHandlerMiddleware: (err, req, res, next) => {
    console.log({ err });
    if (err instanceof ExpressCustomError) {
      return getErrorResponse(res, err.statusCode, err.message, err);
    }

    if (err instanceof SyntaxError) {
      return getErrorResponse(
        res,
        httpStatus.status.INTERNAL_SERVER_ERROR,
        `Syntax error. ${err}`,
        err
      );
    }

    logger.error(`Error not instance of custom error. Error ${err}`);
    console.log('Error not instance of custom error. Error ', err);
    return getErrorResponse(
      res,
      httpStatus.status.INTERNAL_SERVER_ERROR,
      err.message,
      err
    );
  },
};
