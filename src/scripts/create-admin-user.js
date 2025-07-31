require('dotenv').config();
const User = require('../models/User');
require('../database');

async function createAdminUser() {
  try {
    const adminUserExists = await User.findOne({ where: { email: 'admin@example.com' } });

    if (adminUserExists) {
      console.log('Usuário admin já existe.');
      return;
    }

    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password', // A senha será hasheada pelo hook do modelo
      role: 'admin',
      daily_credits: 999,
      is_active: true,
    });

    console.log('Usuário admin criado com sucesso.');
  } catch (error) {
    console.error('Falha ao criar o usuário admin:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
