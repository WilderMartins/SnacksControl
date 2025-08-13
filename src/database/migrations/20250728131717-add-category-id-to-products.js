'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('products');
    if (!table.category_id && table.category) {
      await queryInterface.sequelize.transaction((t) => {
        return Promise.all([
          queryInterface.addColumn(
            'products',
            'category_id',
            {
              type: Sequelize.INTEGER,
              references: { model: 'categories', key: 'id' },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            { transaction: t }
          ),
          queryInterface.removeColumn('products', 'category', { transaction: t }),
        ]);
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('products');
    if (table.category_id && !table.category) {
      await queryInterface.sequelize.transaction((t) => {
        return Promise.all([
          queryInterface.removeColumn('products', 'category_id', {
            transaction: t,
          }),
          queryInterface.addColumn(
            'products',
            'category',
            {
              type: Sequelize.STRING,
              allowNull: true,
            },
            { transaction: t }
          ),
        ]);
      });
    }
  },
};
