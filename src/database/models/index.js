// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const { sequelize } = require('../../configs/database');

// const db = {};

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

const Product = require('./product_model');
const ProductOrder = require('./product_order_model');
const Role = require('./role_model');
const User = require('./user_model');
const Profile = require('./profile_model');

Product.hasMany(ProductOrder, { foreignKey: 'product_id' });
ProductOrder.belongsTo(Product, { foreignKey: 'product_id' });

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'role_id' });

module.exports = {
  Product,
  ProductOrder,
  Profile,
  User,
  Role,
};
