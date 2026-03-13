'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, create ENUM type for PostgreSQL
    await queryInterface.sequelize.query(
      "CREATE TYPE enum_orders_status AS ENUM('Placed','Processing','Shipped','Delivered','Cancelled');"
    );

    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_address: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: 'enum_orders_status', // use the ENUM type we created
        allowNull: false,
        defaultValue: 'Placed',
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
    // Drop ENUM type to clean up
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_status;');
  },
};