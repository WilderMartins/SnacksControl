require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('../database');

async function resetAdminPassword() {
  try {
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });

    if (!adminUser) {
      console.error('Usuário admin não encontrado.');
      return;
    }

    const newPassword = 'password';
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    await adminUser.update({ password: hashedPassword, otp: null, otp_expires_at: null });

    console.log('Senha do administrador resetada com sucesso para "password".');
  } catch (error) {
    console.error('Falha ao resetar a senha do administrador:', error);
  } finally {
    process.exit();
  }
}

resetAdminPassword();
