/* eslint-disable no-unused-vars */
const { ExpressCustomError } = require('../../middlewares/error_middleware');
const {
  decodeToken,
  filterQueries,
  getObjectPagination,
} = require('../../utils/helper');
const {
  getSuccessResponse,
  getPaginationResponse,
} = require('../../utils/responser');
const {
  getProduct,
  storeProduct,
  updateProduct,
  fetchProducts,
  deleteProduct,
} = require('./product.service');

const listObject = [
  'product_code',
  'product_name',
  'product_price',
  'product_stock',
];

module.exports = {
  fetchProducts: async (req, res, next) => {
    const where = filterQueries(req, listObject);

    if (req?.user?.role_name === 'merchant') {
      where.merchant_id = req?.user?.user_id;
    }

    const filter = getObjectPagination(req, ['product_code']);

    const result = await fetchProducts(where, filter);

    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getPaginationResponse(
      req,
      res,
      result.code,
      result.message,
      result.data.items,
      result.data.total_items
    );
  },

  getProduct: async (req, res, next) => {
    const { product_id } = req.params;
    const result = await getProduct(product_id);

    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },

  createProduct: async (req, res, next) => {
    const payload = { ...req?.body, ...decodeToken('created', req) };
    const result = await storeProduct(payload);
    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },

  updateProduct: async (req, res, next) => {
    const payload = { ...req?.body, ...decodeToken('updated', req) };
    const result = await updateProduct(req.params.product_id, payload);
    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },

  deleteProduct: async (req, res, next) => {
    const payload = { ...decodeToken('deleted', req) };
    const result = await deleteProduct(req.params.product_id, payload);
    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },
};
