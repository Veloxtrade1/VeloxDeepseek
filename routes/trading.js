const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Position = require('../models/Position');
const PendingOrder = require('../models/PendingOrder');
const { getCurrentPrice } = require('../services/marketData');
const { checkMargin, enforceLiquidation } = require('../services/riskEngine');
const router = express.Router();

async function placeMarketOrder(userId, symbol, side, quantity) {
  const price = getCurrentPrice(symbol);
  if (!price) throw new Error('Price unavailable');
  const user = await User.findById(userId);
  const balanceField = user.demoMode ? 'demoBalance' : 'realBalance';
  const notional = quantity * price;
  if (user[balanceField] < notional) throw new Error('Insufficient balance');
  const session = await User.startSession();
  session.startTransaction();
  try {
    user[balanceField] -= notional;
    await user.save({ session });
    let pos = await Position.findOne({ userId, symbol }).session(session);
    if (pos) {
      const newQty = pos.quantity + quantity;
      pos.avgPrice = ((pos.avgPrice * pos.quantity) + (price * quantity)) / newQty;
      pos.quantity = newQty;
      await pos.save({ session });
    } else {
      pos = new Position({ userId, symbol, side, quantity, avgPrice: price });
      await pos.save({ session });
    }
    const order = new Order({ userId, symbol, side, quantity, price, type: 'market', status: 'filled' });
    await order.save({ session });
    await session.commitTransaction();
    await enforceLiquidation(userId);
    return { order, balance: user[balanceField] };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally { session.endSession(); }
}

router.post('/order', auth, async (req, res) => {
  const { symbol, side, quantity } = req.body;
  if (!symbol || !side || !quantity || quantity <= 0) return res.status(400).json({ msg: 'Invalid order' });
  try {
    const result = await placeMarketOrder(req.user.id, symbol, side, quantity);
    res.json({ msg: 'Order executed', balance: result.balance });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.post('/pending', auth, async (req, res) => {
  const { symbol, side, type, price, stopPrice, trailAmount, quantity } = req.body;
  const pending = new PendingOrder({ userId: req.user.id, symbol, side, type, price, stopPrice, trailAmount, quantity });
  await pending.save();
  res.json({ msg: 'Pending order placed', id: pending._id });
});

router.get('/pending', auth, async (req, res) => {
  const orders = await PendingOrder.find({ userId: req.user.id, status: 'pending' });
  res.json(orders);
});

router.delete('/pending/:id', auth, async (req, res) => {
  await PendingOrder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: 'Cancelled' });
});

module.exports = router;