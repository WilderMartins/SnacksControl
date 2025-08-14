const jwt = require('jsonwebtoken');
const { addMinutes } = require('date-fns');
const User = require('../models/User');
const authConfig = require('../config/auth');
const MailService = require('../services/MailService');

class SessionController {
  async store(req, res) {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Admin login can use either password or OTP
    if (user.role === 'admin') {
      if (password) {
        if (!(await user.checkPassword(password))) {
          return res.status(401).json({ error: 'Invalid password for admin' });
        }
      } else if (otp) {
        if (user.otp !== otp || new Date() > user.otp_expires_at) {
          return res.status(401).json({ error: 'Invalid or expired OTP for admin' });
        }
        await user.update({ otp: null, otp_expires_at: null });
      } else {
        return res.status(400).json({ error: 'Admin must provide password or OTP' });
      }
    } else {
      // Regular user login flow is enforced by the flag
      if (user.otp_enabled) {
        if (!otp || user.otp !== otp || new Date() > user.otp_expires_at) {
          return res.status(401).json({ error: 'Invalid or expired OTP' });
        }
        await user.update({ otp: null, otp_expires_at: null });
      } else {
        if (!password || !(await user.checkPassword(password))) {
          return res.status(401).json({ error: 'Invalid password' });
        }
      }
    }

    // If we get here, authentication was successful.
    const { id, name, role } = user;
    return res.json({
      user: { id, name, email, role },
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
