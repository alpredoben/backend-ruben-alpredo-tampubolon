const express = require('express');

const authRoute = require('../api/auth/auth.routes');
const productRoute = require('../api/products/product.routes');
const orderRoute = require('../api/orders/order.routes');

const router = express();
const API_TAG = '/api/v1';

router.use(`${API_TAG}/auth`, authRoute);
router.use(`${API_TAG}/products`, productRoute);
router.use(`${API_TAG}/order`, orderRoute);

module.exports = router;
