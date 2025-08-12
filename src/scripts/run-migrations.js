const { Umzug, SequelizeStorage } = require('umzug');
const sequelize = require('../database/index').connection;

console.log('Starting migration script...');

const umzug = new Umzug({
  migrations: { glob: 'src/database/migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

console.log('Umzug instance created.');

(async () => {
  try {
    console.log('Running migrations...');
    await umzug.up();
    console.log('Migrations run successfully.');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    process.exit(1);
  }
})();
