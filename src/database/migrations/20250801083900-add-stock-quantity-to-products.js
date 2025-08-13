'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('products');
    if (!table.stock_quantity) {
      await queryInterface.addColumn('products', 'stock_quantity', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'stock_quantity');
  },
};
