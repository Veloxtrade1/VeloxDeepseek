const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Kyc = require('../models/Kyc');
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/users', adminAuth, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});
router.put('/user/:id', adminAuth, async (req, res) => {
  const { demoBalance, realBalance, kycStatus, demoMode } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { demoBalance, realBalance, kycStatus, demoMode }, { new: true });
  res.json(user);
});
router.get('/deposits', adminAuth, async (req, res) => {
  const deposits = await Transaction.find({ type: 'deposit', status: 'pending' }).populate('userId');
  res.json(deposits);
});
router.post('/confirm-deposit/:id', adminAuth, async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ msg: 'Not found' });
  tx.status = 'completed';
  await tx.save();
  const user = await User.findById(tx.userId);
  if (!user.demoMode) user.realBalance += tx.amount;
  else user.demoBalance += tx.amount;
  await user.save();
  res.json({ msg: 'Deposit confirmed' });
});
router.get('/kyc', adminAuth, async (req, res) => {
  const kycs = await Kyc.find({ status: 'pending' }).populate('userId');
  res.json(kycs);
});
router.post('/kyc/:id', adminAuth, async (req, res) => {
  const { status, comment } = req.body;
  const kyc = await Kyc.findById(req.params.id);
  if (!kyc) return res.status(404).json({ msg: 'Not found' });
  kyc.status = status;
  kyc.adminComment = comment;
  if (status === 'approved') kyc.verifiedAt = new Date();
  await kyc.save();
  await User.findByIdAndUpdate(kyc.userId, { kycStatus: status });
  res.json({ msg: 'KYC updated' });
});
router.post('/impersonate/:userId', adminAuth, async (req, res) => {
  const token = jwt.sign({ user: { id: req.params.userId } }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});
router.get('/logs', adminAuth, async (req, res) => {
  const logs = await Log.find().sort('-createdAt').limit(100);
  res.json(logs);
});
module.exports = router;