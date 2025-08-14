const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../database');

describe('Consumption Controller', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should be able to record a new consumption', async () => {
    const admin = await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      is_active: true,
      daily_credits: 10,
    });

    const otpResponse = await request(app)
      .post('/api/sessions/otp')
      .send({ email: 'admin@example.com' });

    const { otp } = otpResponse.body;

    const sessionResponse = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', otp });

    const { token } = sessionResponse.body;

    const product = await sequelize.models.Product.create({
      name: 'Test Product',
      barcode: '123456789',
      price: 1.99,
      stock_quantity: 10,
    });

    const response = await request(app)
      .post('/api/consumptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        barcode: '123456789',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return a summary of consumptions', async () => {
    const admin = await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      is_active: true,
      daily_credits: 10,
    });

    const otpResponse = await request(app)
      .post('/api/sessions/otp')
      .send({ email: 'admin@example.com' });

    const { otp } = otpResponse.body;

    const sessionResponse = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', otp });

    const { token } = sessionResponse.body;

    const product = await sequelize.models.Product.create({
      name: 'Test Product',
      barcode: '123456789',
      price: 1.99,
      stock_quantity: 10,
    });

    await sequelize.models.Consumption.create({
      user_id: admin.id,
      product_id: product.id,
    });

    const response = await request(app)
      .get('/api/consumptions/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('dailyConsumptions');
    expect(response.body).toHaveProperty('categoryConsumptions');
    expect(response.body).toHaveProperty('totalUsers');
    expect(response.body).toHaveProperty('totalProducts');
    expect(response.body.dailyConsumptions.length).toBe(1);
  });
});
