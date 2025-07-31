require('dotenv').config();
const User = require('../models/User');
require('../database');

async function createDevUser() {
  try {
    await User.create({
      name: 'Wilder Martins',
      email: 'wilder.martins@gmail.com',
      password: 'old_password',
      role: 'admin'
    });
    console.log('Usuário de desenvolvimento criado com sucesso.');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Usuário de desenvolvimento já existe.');
    } else {
      console.error('Falha ao criar usuário de desenvolvimento:', error);
    }
  } finally {
    process.exit();
  }
}

createDevUser();
