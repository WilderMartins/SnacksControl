const Sequelize = require('sequelize');
const config = require('../src/config/database');

const sequelize = new Sequelize(config.test);

const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Consumption = require('../src/models/Consumption');
const Category = require('../src/models/Category');

User.init(sequelize);
Product.init(sequelize);
Consumption.init(sequelize);
Category.init(sequelize);

User.associate(sequelize.models);
Product.associate(sequelize.models);
Consumption.associate(sequelize.models);
Category.associate(sequelize.models);

module.exports = sequelize;
