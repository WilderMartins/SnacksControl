'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // This migration is no longer needed as the 'manager' role is added
    // in the initial create-users migration to support SQLite.
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting this is not necessary as the 'up' migration does nothing.
    return Promise.resolve();
  },
};
