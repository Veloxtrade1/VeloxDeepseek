const express = require('express');
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { symbol, condition, price } = req.body;
  const alert = new Alert({ userId: req.user.id, symbol, condition, price });
  await alert.save();
  res.json(alert);
});
router.get('/', auth, async (req, res) => {
  const alerts = await Alert.find({ userId: req.user.id });
  res.json(alerts);
});
router.delete('/:id', auth, async (req, res) => {
  await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: 'Deleted' });
});
module.exports = router;