const express = require('express');
const auth = require('../middleware/auth');
const PendingOrder = require('../models/PendingOrder');
const { getCurrentPrice } = require('../services/marketData');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { symbol, side, type, price, stopPrice, trailAmount, quantity } = req.body;
  const currentPrice = getCurrentPrice(symbol);
  if (!currentPrice) return res.status(400).json({ msg: 'Price unavailable' });
  const order = new PendingOrder({ userId: req.user.id, symbol, side, type, price, stopPrice, trailAmount, quantity });
  await order.save();
  res.json({ msg: 'Pending order placed', orderId: order._id });
});
router.get('/', auth, async (req, res) => {
  const orders = await PendingOrder.find({ userId: req.user.id, status: 'pending' });
  res.json(orders);
});
router.delete('/:id', auth, async (req, res) => {
  await PendingOrder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: 'Cancelled' });
});
module.exports = router;