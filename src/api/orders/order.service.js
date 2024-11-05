/* eslint-disable import/order */
/* eslint-disable import/no-unresolved */
const { mapingMessage } = require('../../utils/responser');
const httpStatus = require('http-status');
const ProductOrder = require('../../database/models/product_order_model');
const Product = require('../../database/models/product_model');
const { translator } = require('../../lang');

/* eslint-disable no-unused-vars */
module.exports = {
  fetchProductsOrder: async (where, filter) => {
    try {
      const objectFilter = {};

      if (filter?.order && filter?.direction) {
        objectFilter.order = [[filter.direction, filter.order]];
      }

      objectFilter.where = {
        deleted_at: null,
        ...where,
      };

      if (filter?.limit) {
        objectFilter.limit = filter.limit;
      }

      if (filter?.page) {
        objectFilter.offset = (filter.page - 1) * filter.limit;
      }

      const { count: totalRows, rows } =
        await ProductOrder.findAndCountAll(objectFilter);

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product_order.get'),
        {
          items: rows,
          total_items: totalRows,
        }
      );
    } catch (error) {
      console.log({ error });
      return mapingMessage(
        true,
        httpStatus.status.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  },

  getProductOrder: async (order_id) => {
    try {
      const productOrder = await ProductOrder.findOne({
        where: { order_id, deleted_at: null },
      });

      if (!productOrder) {
        return mapingMessage(
          false,
          httpStatus.status.BAD_REQUEST,
          translator.__('message.error.product_order.not_found', {
            id: order_id,
          })
        );
      }

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product_order.get'),
        productOrder
      );
    } catch (error) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.others.server_error')
      );
    }
  },

  storeProductOrder: async (payload) => {
    const { product_id, quantity, customer_id, created_by } = payload;

    const product = await Product.findOne({
      where: { product_id },
    });

    if (!product) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product.not_found', {
          id: product_id,
        })
      );
    }

    if (product.product_stock < quantity) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product.unavailable')
      );
    }

    const totalPrice = product.product_price * quantity;

    let shippingFee = 0;

    let discount = 0;

    if (totalPrice < 100000) shippingFee = 30000;

    if (totalPrice > 100000) discount = totalPrice * 0.1;

    const finalPrice = totalPrice - discount + shippingFee;

    const productOrder = await ProductOrder.create({
      customer_id,
      product_id,
      quantity,
      total_price: totalPrice,
      shipping_fee: shippingFee,
      discount,
      final_price: finalPrice,
      created_by,
      updated_by: created_by,
    });

    if (!productOrder) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product_order.created')
      );
    }

    await product.update({
      product_stock: product.product_stock - quantity,
    });

    await product.save();

    return mapingMessage(
      true,
      httpStatus.status.CREATED,
      translator.__('message.success.product_order.created'),
      productOrder
    );
  },

  updateProductOrder: async (order_id, payload) => {
    const { product_id, quantity, updated_at, updated_by } = payload;

    const productOrder = await ProductOrder.findOne({
      where: { order_id },
    });

    if (!productOrder) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product_order.not_found', {
          id: order_id,
        })
      );
    }

    const product = await Product.findOne({
      where: { product_id },
    });

    if (!product) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product.not_found', {
          id: product_id,
        })
      );
    }

    let qty = productOrder.quantity;
    let stock = product.product_stock;

    if (productOrder.quantity !== quantity) {
      if (productOrder.quantity > quantity) {
        qty = quantity;
        stock += productOrder.quantity - quantity;
      } else {
        qty = quantity;
        stock -= quantity - productOrder.quantity;
      }
    }

    const totalPrice = product.product_price * qty;
    let shippingFee = 0;
    let discount = 0;

    if (totalPrice < 100000) shippingFee = 30000;
    if (totalPrice > 100000) discount = totalPrice * 0.1;

    const finalPrice = totalPrice - discount + shippingFee;

    // Update Product Order
    await productOrder.update({
      product_id,
      quantity: qty,
      total_price: totalPrice,
      shipping_fee: shippingFee,
      discount,
      final_price: finalPrice,
      updated_at,
      updated_by,
    });
    await productOrder.save();

    // Update Product
    await product.update({
      product_stock: stock,
    });
    await product.save();

    return mapingMessage(
      true,
      httpStatus.status.OK,
      translator.__('message.success.product_order.updated'),
      productOrder
    );
  },

  deleteProductOrder: async (order_id, payload) => {
    const { deleted_at, deleted_by } = payload;

    try {
      const productOrder = await ProductOrder.findOne({
        where: { order_id },
      });

      if (!productOrder) {
        return mapingMessage(
          false,
          httpStatus.status.BAD_REQUEST,
          translator.__('message.error.product_order.not_found', {
            id: order_id,
          })
        );
      }

      const { quantity } = productOrder;
      const productId = productOrder.product_id;

      // Delete Product Order
      await productOrder.update({
        deleted_at,
        deleted_by,
      });

      await productOrder.save();

      // Update stock product
      const product = await Product.findOne({
        where: { product_id: productId },
      });

      await product.update({
        product_stock: product.product_stock + quantity,
      });

      await product.save();

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product_order.deleted'),
        product
      );
    } catch (error) {
      return mapingMessage(false, httpStatus.status.BAD_REQUEST, error.message);
    }
  },
};
