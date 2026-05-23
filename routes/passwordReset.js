const express = require('express');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: 'If email exists, reset link sent' });
  const token = crypto.randomBytes(20).toString('hex');
  user.resetToken = token;
  user.resetExpires = Date.now() + 3600000;
  await user.save();
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail(email, 'Password Reset', `Click: ${link}`);
  res.json({ msg: 'Email sent' });
});
router.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();
  res.json({ msg: 'Password updated' });
});
module.exports = router;