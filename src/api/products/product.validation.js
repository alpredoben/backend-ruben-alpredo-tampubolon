const { bodyValidation } = require('../../utils/validation');

module.exports = {
  addProductValidation: [
    bodyValidation('product_name', 'Product Name', 'check'),
    bodyValidation('product_price', 'Product Price', 'check'),
    bodyValidation('product_stock', 'Product Stock', 'check'),
  ],

  updateProductValidation: [
    bodyValidation('product_id', 'Product ID', 'param'),
    bodyValidation('product_name', 'Product Name', 'check'),
    bodyValidation('product_price', 'Product Price', 'check'),
    bodyValidation('product_stock', 'Product Stock', 'check'),
  ],

  checkProductValidation: [bodyValidation('product_id', 'Product ID', 'param')],
};
