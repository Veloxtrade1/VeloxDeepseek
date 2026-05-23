const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Position = require('../models/Position');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const QRCode = require('qrcode');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});
router.get('/positions', auth, async (req, res) => {
  const positions = await Position.find({ userId: req.user.id });
  res.json(positions);
});
router.get('/orders', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
  res.json(orders);
});
router.get('/deposit-address', auth, async (req, res) => {
  const btcAddr = process.env.CRYPTO_BTC_ADDRESS;
  const usdtAddr = process.env.CRYPTO_USDT_ADDRESS;
  const btcQR = await QRCode.toDataURL(btcAddr);
  const usdtQR = await QRCode.toDataURL(usdtAddr);
  res.json({ btc: btcAddr, usdt: usdtAddr, btcQR, usdtQR });
});
router.post('/confirm-deposit', auth, async (req, res) => {
  const { txHash, amount, currency } = req.body;
  const tx = new Transaction({ userId: req.user.id, type: 'deposit', amount, currency, txHash, status: 'pending' });
  await tx.save();
  res.json({ msg: 'Deposit recorded, pending confirmation', txId: tx._id });
});
router.post('/withdraw', auth, async (req, res) => {
  const { amount, address, currency } = req.body;
  const user = await User.findById(req.user.id);
  const balanceField = user.demoMode ? 'demoBalance' : 'realBalance';
  if (user[balanceField] < amount) return res.status(400).json({ msg: 'Insufficient balance' });
  const tx = new Transaction({ userId: user.id, type: 'withdrawal', amount, currency, txHash: address, status: 'pending' });
  await tx.save();
  user[balanceField] -= amount;
  await user.save();
  res.json({ msg: 'Withdrawal request submitted', balance: user[balanceField] });
});
router.post('/switch-mode', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!process.env.REAL_MONEY_ENABLED === 'true') return res.status(403).json({ msg: 'Real money mode disabled' });
  user.demoMode = !user.demoMode;
  await user.save();
  res.json({ demoMode: user.demoMode, balance: user.balance });
});
module.exports = router;