'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'products',
          'category_id',
          {
            type: DataTypes.INTEGER,
            references: { model: 'categories', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          { transaction: t }
        ),
        queryInterface.removeColumn('products', 'category', { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('products', 'category_id', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'products',
          'category',
          {
            type: DataTypes.STRING,
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
