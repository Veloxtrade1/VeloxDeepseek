const express = require('express');
const Signal = require('../models/Signal');
const { generateSignal } = require('../services/aiSignals');
const router = express.Router();
router.get('/', async (req, res) => {
  const signals = await Signal.find().sort('-createdAt').limit(20);
  res.json(signals);
});
router.post('/generate', async (req, res) => {
  const { symbol, price, rsi, macd } = req.body;
  const aiOutput = await generateSignal(symbol, price, rsi, macd);
  const signal = new Signal({ symbol, action: 'buy', entryPrice: price, confidence: 75, reasoning: aiOutput });
  await signal.save();
  res.json(signal);
});
module.exports = router;