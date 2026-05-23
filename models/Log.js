const mongoose = require('mongoose');
const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  details: Object,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now, index: true }
});
module.exports = mongoose.model('Log', LogSchema);