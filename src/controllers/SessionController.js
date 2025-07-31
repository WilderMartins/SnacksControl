const jwt = require('jsonwebtoken');
const { addMinutes } = require('date-fns');
const User = require('../models/User');
const authConfig = require('../config/auth');
const MailService = require('../services/MailService');

class SessionController {
  async store(req, res) {
    console.log('-> Entrou em SessionController.store');
    const { email, password, otp } = req.body;
    console.log('Dados de login recebidos:', { email, password: password ? '***' : undefined, otp });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Password-based login
    if (password) {
      if (!(await user.checkPassword(password))) {
        console.log('Comparação de senha falhou.');
        return res.status(401).json({ error: 'Invalid password' });
      }
    }
    // OTP-based login
    else if (otp) {
      if (user.otp !== otp || new Date() > user.otp_expires_at) {
        return res.status(401).json({ error: 'Invalid OTP' });
      }
      await user.update({ otp: null, otp_expires_at: null });
    }
    // No credentials provided
    else {
      return res.status(400).json({ error: 'Provide password or OTP' });
    }

    const { id, name, role } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        role,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async sendOtp(req, res) {
    console.log('-> Entrou em SessionController.sendOtp');
    const { email } = req.body;
    console.log('E-mail recebido para envio de OTP:', email);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = addMinutes(new Date(), 5);

    await user.update({ otp, otp_expires_at });

    if (process.env.NODE_ENV !== 'test') {
      try {
        await MailService.sendOtp(email, otp);
      } catch (error) {
        console.error('Failed to send OTP email', error);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      }
    }

    return res.status(200).json({ otp });
  }
}

module.exports = new SessionController();
