const speakeasy = require('speakeasy');
const User = require('../models/User');
module.exports = async (req, res, next) => {
  if (req.user && req.user.twoFactorEnabled) {
    const token = req.headers['x-2fa-token'];
    if (!token) return res.status(401).json({ msg: '2FA token required', twoFactorRequired: true });
    const user = await User.findById(req.user.id);
    const verified = speakeasy.totp.verify({ secret: user.totpSecret, encoding: 'base32', token });
    if (!verified) return res.status(401).json({ msg: 'Invalid 2FA token' });
  }
  next();
};