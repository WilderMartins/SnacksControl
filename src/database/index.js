const Sequelize = require('sequelize');
const User = require('../models/User');
const Product = require('../models/Product');
const Consumption = require('../models/Consumption');
const Category = require('../models/Category');

const databaseConfig = require('../config/database');

const models = [User, Product, Consumption, Category];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig[process.env.NODE_ENV || 'development']);

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }
}

module.exports = new Database();
