const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../database');

describe('Session Controller', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should be able to authenticate with a valid password', async () => {
    await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
      is_active: true,
    });

    const response = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate with an invalid password', async () => {
    await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin',
      is_active: true,
    });

    const response = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
  });

  it('should be able to send an OTP to a valid user', async () => {
    await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      is_active: true,
    });

    const response = await request(app)
      .post('/api/sessions/otp')
      .send({ email: 'admin@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('otp');
  });

  it('should be able to authenticate with a valid OTP', async () => {
    const user = await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      is_active: true,
    });

    const otpResponse = await request(app)
      .post('/api/sessions/otp')
      .send({ email: 'admin@example.com' });

    const { otp } = otpResponse.body;

    const response = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', otp });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
