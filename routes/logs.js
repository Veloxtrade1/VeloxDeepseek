const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const Log = require('../models/Log');
const router = express.Router();

router.get('/', adminAuth, async (req, res) => {
  const logs = await Log.find().sort('-createdAt').limit(200);
  res.json(logs);
});
module.exports = router;