const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const speakeasy = require('speakeasy');
const { createSession } = require('../middleware/sessionManager');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, country } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ msg: 'User exists' });
    const allowed = ['Pakistan','Bangladesh','Sri Lanka','Nepal','Bhutan','Maldives'];
    if (!allowed.includes(country)) return res.status(400).json({ msg: 'Country not supported' });
    const user = new User({ email, password, fullName, country });
    await user.save();
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
    await createSession(user.id, token, req);
    res.json({ token, user: { id: user.id, email, balance: user.balance, fullName, country, kycStatus: user.kycStatus, demoMode: user.demoMode } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    if (user.twoFactorEnabled) {
      const token2fa = req.headers['x-2fa-token'];
      if (!token2fa) return res.status(401).json({ msg: '2FA token required', twoFactorRequired: true });
      const verified = speakeasy.totp.verify({ secret: user.totpSecret, encoding: 'base32', token: token2fa });
      if (!verified) return res.status(401).json({ msg: 'Invalid 2FA token' });
    }
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
    await createSession(user.id, token, req);
    res.json({ token, user: { id: user.id, email, balance: user.balance, fullName: user.fullName, country: user.country, kycStatus: user.kycStatus, demoMode: user.demoMode } });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  const token = jwt.sign({ user: { id: req.user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });
  await createSession(req.user.id, token, req);
  res.redirect(`${process.env.FRONTEND_URL}/dashboard/overview?token=${token}`);
});

module.exports = router;