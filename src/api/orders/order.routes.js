const router = require('express').Router();
const {
  authMiddleware,
  customerAuthMiddleware,
} = require('../../middlewares/auth_middleware');
const {
  fetchProductsOrder,
  getProductOrder,
  createProductOrder,
  updateProductOrder,
  deleteProductOrder,
} = require('./order.handler');
const {
  reqValidatorMiddleware,
} = require('../../middlewares/validation_middleware');
const {
  addProductOrderValidation,
  updateProductOrderValidation,
  checkProductOrderValidation,
} = require('./order.validation');

router.get('/', authMiddleware, fetchProductsOrder);
router.get(
  '/:order_id',
  reqValidatorMiddleware(checkProductOrderValidation),
  authMiddleware,
  getProductOrder
);
router.post(
  '/',
  reqValidatorMiddleware(addProductOrderValidation),
  customerAuthMiddleware,
  createProductOrder
);
router.put(
  '/:order_id',
  reqValidatorMiddleware(updateProductOrderValidation),
  customerAuthMiddleware,
  updateProductOrder
);
router.delete(
  '/:order_id',
  reqValidatorMiddleware(checkProductOrderValidation),
  customerAuthMiddleware,
  deleteProductOrder
);

module.exports = router;
