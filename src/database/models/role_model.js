// src/models/roleModel.js
const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../../configs/database');

const Role = sequelize.define(
  'Role',
  {
    role_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    tableName: 'roles',
  }
);

module.exports = Role;
