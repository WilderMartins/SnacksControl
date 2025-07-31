const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../database');

describe('Product Controller', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should be able to create a new product', async () => {
    const admin = await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      is_active: true,
    });

    const otpResponse = await request(app)
      .post('/api/sessions/otp')
      .send({ email: 'admin@example.com' });

    const { otp } = otpResponse.body;

    const sessionResponse = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', otp });

    const { token } = sessionResponse.body;

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        barcode: '123456789',
        price: 1.99,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
