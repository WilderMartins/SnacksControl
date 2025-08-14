const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../database');
const User = require('../../src/models/User');

describe('Password Reset', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should generate a password reset token for an admin user', async () => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'old_password',
      role: 'admin',
    });

    const response = await request(app)
      .post('/api/sessions/forgot-password')
      .send({ email: 'admin@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');

    const userInDb = await User.findByPk(admin.id);
    expect(userInDb.password_reset_token).toBe(response.body.token);
    expect(userInDb.password_reset_expires).not.toBeNull();
  });

  it('should not generate a password reset token for a non-admin user', async () => {
    await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    const response = await request(app)
      .post('/api/sessions/forgot-password')
      .send({ email: 'user@example.com' });

    expect(response.status).toBe(200);
    // The body should be empty or have a generic message, not a token
    expect(response.body.token).toBeUndefined();
  });

  it('should allow an admin to reset their password with a valid token', async () => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'old_password',
      role: 'admin',
    });

    // Step 1: Get the reset token
    const forgotResponse = await request(app)
      .post('/api/sessions/forgot-password')
      .send({ email: 'admin@example.com' });

    const { token } = forgotResponse.body;

    // Step 2: Reset the password
    const newPassword = 'new_password';
    const resetResponse = await request(app)
      .post('/api/sessions/reset-password')
      .send({ token, password: newPassword });

    expect(resetResponse.status).toBe(200);
    expect(resetResponse.body.message).toBe('Password has been reset successfully.');

    // Step 3: Verify the new password works
    const loginResponse = await request(app)
      .post('/api/sessions')
      .send({ email: 'admin@example.com', password: newPassword });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    // Step 4: Verify token is cleared in DB
    const userInDb = await User.findByPk(admin.id);
    expect(userInDb.password_reset_token).toBeNull();
    expect(userInDb.password_reset_expires).toBeNull();
  });
});
