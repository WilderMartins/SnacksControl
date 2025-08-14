const jwt = require('jsonwebtoken');
const { addMinutes } = require('date-fns');
const crypto = require('crypto');
const { Op } = require('sequelize');
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
    const { email } = req.body;

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

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user || user.role !== 'admin') {
        // Do not reveal if the user exists or is an admin.
        return res.status(200).send({ message: 'If an admin account with this email exists, a password reset link has been sent.' });
      }

      const token = crypto.randomBytes(20).toString('hex');
      const now = new Date();
      now.setHours(now.getHours() + 1); // Token valid for 1 hour

      await user.update({
        password_reset_token: token,
        password_reset_expires: now,
      });

      if (process.env.NODE_ENV !== 'test') {
        try {
          await MailService.sendPasswordResetEmail(email, token);
        } catch (error) {
          console.error('Failed to send password reset email', error);
        }
      }

      if (process.env.NODE_ENV === 'test') {
        return res.status(200).json({ token });
      }

      return res.status(200).send({ message: 'If an admin account with this email exists, a password reset link has been sent.' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'An internal error occurred.' });
    }
  }

  async resetPassword(req, res) {
    const { token, password } = req.body;

    try {
      const user = await User.findOne({
        where: {
          password_reset_token: token,
          password_reset_expires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired.' });
      }

      user.password = password;
      user.password_reset_token = null;
      user.password_reset_expires = null;

      await user.save();

      return res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Failed to reset password, please try again.' });
    }
  }
}

module.exports = new SessionController();
