const express = require('express');
const auth = require('../middleware/auth');
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { name, permissions } = req.body;
  const key = crypto.randomBytes(16).toString('hex');
  const secret = crypto.randomBytes(32).toString('hex');
  const apiKey = new ApiKey({ userId: req.user.id, name, key, secret, permissions });
  await apiKey.save();
  res.json({ key, secret });
});
router.get('/', auth, async (req, res) => {
  const keys = await ApiKey.find({ userId: req.user.id }).select('-secret');
  res.json(keys);
});
router.delete('/:id', auth, async (req, res) => {
  await ApiKey.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: 'Deleted' });
});
module.exports = router;