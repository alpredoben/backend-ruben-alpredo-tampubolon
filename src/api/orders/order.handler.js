const {
  filterQueries,
  getObjectPagination,
  decodeToken,
} = require('../../utils/helper');
const {
  fetchProductsOrder,
  getProductOrder,
  storeProductOrder,
  updateProductOrder,
  deleteProductOrder,
} = require('./order.service');
const { ExpressCustomError } = require('../../middlewares/error_middleware');
const {
  getPaginationResponse,
  getSuccessResponse,
} = require('../../utils/responser');

const listObject = [
  'quantity',
  'product_id',
  'total_price',
  'shipping_fee',
  'discount',
];
/* eslint-disable no-unused-vars */
module.exports = {
  fetchProductsOrder: async (req, res, next) => {
    const where = filterQueries(req, listObject);
    const filter = getObjectPagination(req, ['product_code']);

    const result = await fetchProductsOrder(where, filter);

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

  getProductOrder: async (req, res, next) => {
    const { order_id } = req.params;
    const result = await getProductOrder(order_id);

    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },

  createProductOrder: async (req, res, next) => {
    const payload = {
      ...req?.body,
      ...decodeToken('created', req),
      customer_id: req?.user?.user_id,
    };
    const result = await storeProductOrder(payload);
    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },

  updateProductOrder: async (req, res, next) => {
    const payload = { ...req?.body, ...decodeToken('updated', req) };
    const result = await updateProductOrder(req.params.order_id, payload);
    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },

  deleteProductOrder: async (req, res, next) => {
    const payload = { ...decodeToken('deleted', req) };
    const result = await deleteProductOrder(req.params.product_id, payload);
    if (result.success === false) {
      next(new ExpressCustomError(result.message, result.code));
    }

    return getSuccessResponse(res, result.code, result.message, result.data);
  },
};
