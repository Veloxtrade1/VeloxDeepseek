const mongoose = require('mongoose');
const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: String,
  deviceInfo: String,
  ip: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Session', SessionSchema);