// src/models/profileModel.js
const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../../configs/database');

const ProductOrder = sequelize.define(
  'ProductOrder',
  {
    order_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'products',
        key: 'user_id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
    },
    shipping_fee: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
    },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
    },
    final_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    tableName: 'product_orders',
  }
);

module.exports = ProductOrder;
