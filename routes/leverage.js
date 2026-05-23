const express = require('express');
const auth = require('../middleware/auth');
const LeverageProfile = require('../models/LeverageProfile');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const profiles = await LeverageProfile.find({ userId: req.user.id });
  res.json(profiles);
});
router.post('/', auth, async (req, res) => {
  const { symbol, leverage } = req.body;
  let profile = await LeverageProfile.findOne({ userId: req.user.id, symbol });
  if (!profile) profile = new LeverageProfile({ userId: req.user.id, symbol, leverage });
  else profile.leverage = leverage;
  await profile.save();
  res.json(profile);
});
module.exports = router;