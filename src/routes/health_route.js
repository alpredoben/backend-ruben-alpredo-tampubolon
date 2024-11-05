/* eslint-disable no-unused-vars */
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const { translator } = require('../lang');
const { getSuccessResponse } = require('../utils/responser');
const { getFormatDate } = require('../utils/helper');
const { APP } = require('../configs/environments');
const { optionSwagger } = require('../docs');

const getResponseTime = (start = process.hrtime()) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

router.get('/', (req, res) =>
  getSuccessResponse(
    res,
    200,
    translator.__('message.success.info.route_api'),
    {
      response_time: `${getResponseTime()}(ms)`,
      app_name: APP.NAME,
      uptime: process.uptime,
      timestamp: getFormatDate(new Date(), 'DD MMMM YYYY, H:mm:ss'),
      documentation: `http://${req.get('host')}/documentation`,
    }
  )
);

if (APP.ENV.toString().toLowerCase() === 'development') {
  router.use('/documentation', swaggerUi.serve);
  router.get(
    '/documentation',
    swaggerUi.setup(optionSwagger, { isExplorer: false })
  );
}

module.exports = router;
