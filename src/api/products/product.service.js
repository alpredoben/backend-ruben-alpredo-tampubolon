/* eslint-disable import/no-unresolved */
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Product } = require('../../database/models');
const { translator } = require('../../lang');
const { mapingMessage } = require('../../utils/responser');

module.exports = {
  fetchProducts: async (where, filter) => {
    try {
      const objectFilter = {};

      if (filter?.order && filter?.direction) {
        objectFilter.order = [[filter.direction, filter.order]];
      }

      objectFilter.where = {
        deleted_at: null,
        ...where,
      };

      if (filter?.search && filter?.search !== '') {
        const { search } = filter;
        objectFilter.where = {
          [Op.or]: [
            { product_code: { [Op.like]: `%${search}%` } }, // Case-insensitive search on `product_code`
            { product_name: { [Op.like]: `%${search}%` } }, // Add other fields as needed
          ],
        };
      }

      if (filter?.limit) {
        objectFilter.limit = filter.limit;
      }

      if (filter?.page) {
        objectFilter.offset = (filter.page - 1) * filter.limit;
      }

      console.log({ objectFilter });

      const { count: totalRows, rows } =
        await Product.findAndCountAll(objectFilter);

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product.get'),
        {
          items: rows,
          total_items: totalRows,
        }
      );
    } catch (error) {
      return mapingMessage(
        true,
        httpStatus.status.INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  },

  getProduct: async (product_id) => {
    try {
      const product = await Product.findOne({
        where: { product_id, deleted_at: null },
      });

      if (!product) {
        return mapingMessage(
          false,
          httpStatus.status.BAD_REQUEST,
          translator.__('message.error.product.not_found', { id: product_id })
        );
      }

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product.get'),
        product
      );
    } catch (error) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.others.server_error')
      );
    }
  },

  storeProduct: async (payload) => {
    const {
      product_code,
      product_name,
      product_price,
      product_stock,
      created_by,
    } = payload;

    const existingProduct = await Product.findOne({
      where: { product_code },
    });

    if (existingProduct) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product.existed', { code: product_code })
      );
    }

    const product = await Product.create({
      merchant_id: created_by,
      product_code,
      product_name,
      product_price,
      product_stock,
      created_by,
      updated_by: created_by,
    });

    if (!product) {
      return mapingMessage(
        false,
        httpStatus.status.BAD_REQUEST,
        translator.__('message.error.product.created')
      );
    }

    return mapingMessage(
      true,
      httpStatus.status.CREATED,
      translator.__('message.success.product.created'),
      product
    );
  },

  updateProduct: async (product_id, payload) => {
    const {
      product_code,
      product_name,
      product_price,
      product_stock,
      updated_by,
      updated_at,
    } = payload;

    try {
      const product = await Product.findOne({
        where: { product_id },
      });

      if (!product) {
        return mapingMessage(
          false,
          httpStatus.status.BAD_REQUEST,
          translator.__('message.error.product.not_found', { id: product_id })
        );
      }

      await product.update({
        product_code,
        product_name,
        product_price,
        product_stock,
        updated_by,
        updated_at,
      });

      await product.save();

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product.updated'),
        product
      );
    } catch (error) {
      return mapingMessage(false, httpStatus.status.BAD_REQUEST, error.message);
    }
  },

  deleteProduct: async (product_id, payload) => {
    const { deleted_at, deleted_by } = payload;

    try {
      const product = await Product.findOne({
        where: { product_id },
      });

      if (!product) {
        return mapingMessage(
          false,
          httpStatus.status.BAD_REQUEST,
          translator.__('message.error.product.not_found', { id: product_id })
        );
      }

      await product.update({
        deleted_at,
        deleted_by,
      });

      await product.save();

      return mapingMessage(
        true,
        httpStatus.status.OK,
        translator.__('message.success.product.deleted'),
        product
      );
    } catch (error) {
      return mapingMessage(false, httpStatus.status.BAD_REQUEST, error.message);
    }
  },
};
