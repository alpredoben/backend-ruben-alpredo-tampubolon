/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const { inHTMLData } = require('xss-filters');
const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status');
const dayjs = require('dayjs');
const { LIMITTER } = require('../configs/environments');
const { translator } = require('../lang');
const { getSuccessResponse } = require('./responser');
const { getUserFromToken } = require('./jwt_token');

const limitRetried = rateLimit({
  window: Number(LIMITTER.RETRY) * 60 * 1000, // 15 minutes
  limit: Number(LIMITTER.RATE_MAX), // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: false, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  keyGenerator: (req, res) =>
    req.headers.realip ? req.headers.realip : req.headers['x-real-ip'],
  handler: (req, res, next, _options) =>
    getSuccessResponse(
      res,
      httpStatus['201_CLASS'],
      translator.__('message.error.others.limit_rate', {
        minutes: LIMITTER.RETRY,
      }),
      {}
    ),
});

const filterAndCleanObject = (data) => {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = inHTMLData(data).trim();
  if (isObject) data = JSON.parse(data);

  return data;
};

const getFormatDate = (date = new Date(), strFormat = 'YYYY-MM-DD HH:mm:ss') =>
  dayjs(date).format(strFormat);

const dateNow = () => dayjs(new Date()).format();

const decodeToken = (type, req) => {
  try {
    let payload = {};
    const tokenHeader = req?.headers?.authorization ?? '';
    const token = tokenHeader.split(' ')[1];
    const decode = getUserFromToken(token);

    switch (type) {
      case 'created':
        payload.created_by = decode?.user_id ?? 0;
        break;
      case 'updated':
        payload.updated_by = decode?.user_id ?? 0;
        payload.updated_at = dateNow();
        break;
      case 'deleted':
        payload.deleted_by = decode?.user_id ?? 0;
        payload.deleted_at = dateNow();
        break;
      case 'default':
        payload.users_id = decode?.user_id ?? 0;
        break;
      case 'getRoles':
        return decode?.role_id;
      case 'refreshToken':
        payload.users_id = decode?.user_id;
        payload.role_id = decode?.role_id;
        payload.email = decode?.email;
        break;
      case 'getAccess':
        payload = decode;
        break;
      default:
        return payload;
    }
    if (process.env.APP_ENV === 'development') {
      console.info(`decoded token is : ${JSON.stringify(payload)})`);
    }
    return payload;
  } catch (error) {
    if (process.env.APP_ENV === 'development') {
      console.error(`error decoded token : ${error})`);
    }
    return {
      users_id: '',
      created_by: '',
      role_id: null,
    };
  }
};

const filterQueries = (req, column = []) => {
  const push = {};
  const asArray = Object.entries(req.query);
  const filtered = asArray.filter(([key]) => column.includes(key));
  const newObject = Object.fromEntries(filtered);

  for (const prop in newObject) {
    if (prop) {
      push[prop] = newObject[prop];
    }
  }
  return push;
};

const getObjectPagination = (req, defaultOrder = []) => {
  const direction = req?.query?.direction || defaultOrder[0];
  const order = req?.query?.order || defaultOrder[1];
  const page = Number(req?.query?.page) || 1;
  const limit = req?.query?.limit || 10;
  const offset = req?.query?.offset || 0;
  const search = req?.query?.search;

  return {
    order,
    direction,
    offset,
    page,
    limit,
    search,
  };
};

module.exports = {
  filterAndCleanObject,
  limitRetried,
  getFormatDate,
  decodeToken,
  filterQueries,
  getObjectPagination,
};
