require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('../database');

async function resetUserPassword() {
  const email = process.argv[2];

  if (!email) {
    console.error('Por favor, forneça um e-mail como argumento.');
    process.exit(1);
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error(`Usuário com e-mail "${email}" não encontrado.`);
      return;
    }

    const newPassword = 'password';
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    await user.update({ password: hashedPassword, otp: null, otp_expires_at: null });

    console.log(`Senha do usuário com e-mail "${email}" resetada com sucesso para "password".`);
  } catch (error) {
    console.error('Falha ao resetar a senha do usuário:', error);
  } finally {
    process.exit();
  }
}

resetUserPassword();
