const router = require('express').Router();
const {
  authMiddleware,
  merchantAuthMiddleware,
} = require('../../middlewares/auth_middleware');
const {
  fetchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('./product.handler');
const {
  reqValidatorMiddleware,
} = require('../../middlewares/validation_middleware');
const {
  addProductValidation,
  updateProductValidation,
  checkProductValidation,
} = require('./product.validation');

router.get('/', authMiddleware, fetchProducts);
router.get(
  '/:product_id',
  reqValidatorMiddleware(checkProductValidation),
  authMiddleware,
  getProduct
);
router.post(
  '/',
  reqValidatorMiddleware(addProductValidation),
  merchantAuthMiddleware,
  createProduct
);
router.put(
  '/:product_id',
  reqValidatorMiddleware(updateProductValidation),
  merchantAuthMiddleware,
  updateProduct
);
router.delete(
  '/:product_id',
  reqValidatorMiddleware(checkProductValidation),
  merchantAuthMiddleware,
  deleteProduct
);

module.exports = router;
