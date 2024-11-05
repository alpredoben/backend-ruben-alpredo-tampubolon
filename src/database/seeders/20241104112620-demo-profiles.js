/* eslint-disable no-unused-vars */
const { v4: uuidv4 } = require('uuid');

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

    const customers = await queryInterface.sequelize.query(
      `SELECT user_id, email FROM users WHERE email = 'customer@example.com';`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const merchant = await queryInterface.sequelize.query(
      `SELECT user_id, email FROM users WHERE email = 'merchant@example.com';`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('profiles', [
      {
        profile_id: uuidv4(),
        user_id: customers?.length > 0 ? customers[0].user_id : null,
        first_name: 'Cristiano',
        last_name: 'Ronaldo',
        address: '123 Test Street',
        phone: '123-456-7890',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        profile_id: uuidv4(),
        user_id: merchant?.length > 0 ? merchant[0].user_id : null,
        first_name: 'Lionel',
        last_name: 'Messi',
        address: '456 User Ave',
        phone: '098-765-4321',
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
    await queryInterface.bulkDelete('profiles', null, {});
  },
};
