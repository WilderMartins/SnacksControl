'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("ALTER TYPE \"enum_users_role\" ADD VALUE 'manager'");
  },

  down: async (queryInterface, Sequelize) => {
    // There is no easy way to remove a value from an enum in PostgreSQL.
    // The easiest way is to create a new enum with the desired values,
    // update the table to use the new enum, and then drop the old enum.
    // This is a destructive operation, so we will not implement it here.
  },
};
