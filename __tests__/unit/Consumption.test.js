const sequelize = require('../database');
const Consumption = require('../../src/models/Consumption');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');

describe('Consumption Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create a new consumption record', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'some_hash',
      daily_credits: 5,
      is_admin: false,
    });

    const product = await Product.create({
      name: 'Test Product',
      barcode: '123456789',
      price: 1.99,
    });

    const consumption = await Consumption.create({
      user_id: user.id,
      product_id: product.id,
    });

    expect(consumption.user_id).toBe(user.id);
    expect(consumption.product_id).toBe(product.id);
  });
});
