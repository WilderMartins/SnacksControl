const sequelize = require('../database');
const User = require('../../src/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create a new user', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'some_hash',
      daily_credits: 5,
      is_admin: false,
    });

    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
