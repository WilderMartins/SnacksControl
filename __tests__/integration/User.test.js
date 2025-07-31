const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../database');

const bcrypt = require('bcryptjs');

describe('User Controller', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should be able to create a new user', async () => {
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
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        daily_credits: 5,
        is_admin: false,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
