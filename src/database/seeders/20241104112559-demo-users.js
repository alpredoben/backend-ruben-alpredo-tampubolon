/* eslint-disable no-unused-vars */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    // Fetch role IDs for association
    const roles = await queryInterface.sequelize.query(
      'SELECT role_id, role_name FROM roles;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const customerRoleID = roles.find(
      (role) => role.role_name === 'customer'
    ).role_id;
    const merchantRoleID = roles.find(
      (role) => role.role_name === 'merchant'
    ).role_id;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('password123', salt);

    await queryInterface.bulkInsert('users', [
      {
        user_id: uuidv4(),
        email: 'customer@example.com',
        password: hashedPassword,
        salt,
        role_id: customerRoleID,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: uuidv4(),
        email: 'merchant@example.com',
        password: hashedPassword,
        salt,
        role_id: merchantRoleID,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
