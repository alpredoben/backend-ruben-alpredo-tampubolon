// src/models/profileModel.js
const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../../configs/database');

const Product = sequelize.define(
  'Product',
  {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
    },
    product_stock: {
      type: DataTypes.INTEGER,
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
    tableName: 'products',
  }
);

module.exports = Product;
