const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const router = express.Router();

router.post('/enable', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const secret = speakeasy.generateSecret({ name: `${process.env.TOTP_ISSUER}:${user.email}` });
  user.totpSecret = secret.base32;
  await user.save();
  const qr = await QRCode.toDataURL(secret.otpauth_url);
  res.json({ qr, secret: secret.base32 });
});
router.post('/verify', auth, async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);
  const verified = speakeasy.totp.verify({ secret: user.totpSecret, encoding: 'base32', token });
  if (!verified) return res.status(401).json({ msg: 'Invalid token' });
  user.twoFactorEnabled = true;
  await user.save();
  res.json({ msg: '2FA enabled' });
});
router.post('/disable', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { twoFactorEnabled: false, totpSecret: null });
  res.json({ msg: '2FA disabled' });
});
module.exports = router;