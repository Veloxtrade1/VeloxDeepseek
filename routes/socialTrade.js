const express = require('express');
const SocialTrade = require('../models/SocialTrade');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/top', async (req, res) => {
  const topTraders = await SocialTrade.aggregate([{ $group: { _id: '$userId', totalProfit: { $sum: '$profit' } } }, { $sort: { totalProfit: -1 } }, { $limit: 10 }]);
  res.json(topTraders);
});
router.post('/copy/:tradeId', auth, async (req, res) => {
  const { quantity } = req.body;
  const parentTrade = await SocialTrade.findById(req.params.tradeId);
  if (!parentTrade) return res.status(404).json({ msg: 'Trade not found' });
  parentTrade.copyTrades.push({ userId: req.user.id, quantity });
  await parentTrade.save();
  res.json({ msg: 'Now copying this trader' });
});
module.exports = router;