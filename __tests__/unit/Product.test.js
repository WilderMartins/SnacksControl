const sequelize = require('../database');
const Product = require('../../src/models/Product');

describe('Product Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create a new product', async () => {
    const product = await Product.create({
      name: 'Test Product',
      barcode: '123456789',
      price: 1.99,
    });

    expect(product.name).toBe('Test Product');
    expect(product.barcode).toBe('123456789');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
