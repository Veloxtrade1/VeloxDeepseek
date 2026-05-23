const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const SwapRate = require('../models/SwapRate');
const router = express.Router();

router.get('/', async (req, res) => {
  const rates = await SwapRate.find();
  res.json(rates);
});
router.post('/', adminAuth, async (req, res) => {
  const { symbol, longRate, shortRate } = req.body;
  let rate = await SwapRate.findOne({ symbol });
  if (!rate) rate = new SwapRate({ symbol, longRate, shortRate, effectiveDate: new Date() });
  else { rate.longRate = longRate; rate.shortRate = shortRate; rate.effectiveDate = new Date(); }
  await rate.save();
  res.json(rate);
});
module.exports = router;