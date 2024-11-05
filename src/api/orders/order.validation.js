const { bodyValidation } = require('../../utils/validation');

module.exports = {
  addProductOrderValidation: [
    bodyValidation('product_id', 'Product ID', 'check'),
    bodyValidation('quantity', 'Quantity', 'check'),
  ],

  updateProductOrderValidation: [
    bodyValidation('product_id', 'Product ID', 'check'),
    bodyValidation('quantity', 'Quantity', 'check'),
  ],

  checkProductOrderValidation: [
    bodyValidation('order_id', 'Product Order ID', 'param'),
  ],
};
