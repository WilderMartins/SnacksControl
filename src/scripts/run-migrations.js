const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../database/index').connection;

const Sequelize = require('sequelize');

const umzug = new Umzug({
  migrations: {
    glob: 'src/database/migrations/*.js',
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },

  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});


(async () => {
  try {

    await umzug.up();
    console.log('Migrations run successfully.');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    process.exit(1);
  }
})();
