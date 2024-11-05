/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const { JWT } = require('../configs/environments');
const { getErrorResponse } = require('../utils/responser');
const { translator } = require('../lang');
const { Role } = require('../database/models');

module.exports = {
  authMiddleware: async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assumes "Bearer <token>"

    if (!token) {
      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.token_denied'),
        token
      );
    }

    try {
      const decoded = jwt.verify(token, JWT.SECRET_KEY);

      const findRole = await Role.findOne({
        where: { role_id: decoded.role_id },
      });

      req.user = { ...decoded, role_name: findRole.role_name };
      next();
    } catch (error) {
      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.token_expired'),
        token
      );
    }
  },

  customerAuthMiddleware: async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assumes "Bearer <token>"

    if (!token) {
      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.token_denied'),
        token
      );
    }

    try {
      const decoded = jwt.verify(token, JWT.SECRET_KEY);

      const findRole = await Role.findOne({
        where: { role_id: decoded.role_id },
      });

      if (findRole && findRole?.role_name === 'customer') {
        req.user = { ...decoded, role_name: findRole.role_name };
        next();
        return;
      }

      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.unautorized')
      );
    } catch (error) {
      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.token_expired'),
        error
      );
    }
  },

  merchantAuthMiddleware: async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assumes "Bearer <token>"

    if (!token) {
      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.token_denied'),
        token
      );
    }

    try {
      const decoded = jwt.verify(token, JWT.SECRET_KEY);

      const findRole = await Role.findOne({
        where: { role_id: decoded.role_id },
      });

      if (findRole && findRole?.role_name === 'merchant') {
        req.user = { ...decoded, role_name: findRole.role_name };
        next();
      }

      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.unautorized')
      );
    } catch (error) {
      return getErrorResponse(
        res,
        httpStatus.status.UNAUTHORIZED,
        translator.__('message.error.auth.token_expired'),
        error
      );
    }
  },
};
