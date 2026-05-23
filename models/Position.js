const mongoose = require('mongoose');
const PositionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  side: { type: String, enum: ['buy','sell'] },
  quantity: Number,
  avgPrice: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Position', PositionSchema);