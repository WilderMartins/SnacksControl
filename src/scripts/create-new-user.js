require('dotenv').config();
const User = require('../models/User');
require('../database');

async function createNewUser() {
  try {
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'admin'
    });
    console.log('Novo usuário de teste criado com sucesso.');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Novo usuário de teste já existe.');
    } else {
      console.error('Falha ao criar novo usuário de teste:', error);
    }
  } finally {
    process.exit();
  }
}

createNewUser();
