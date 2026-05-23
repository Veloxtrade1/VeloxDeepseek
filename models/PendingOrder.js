const mongoose = require('mongoose');
const PendingOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  side: { type: String, enum: ['buy','sell'] },
  type: { type: String, enum: ['limit','stop','stop_limit','trailing_stop'] },
  price: Number,
  stopPrice: Number,
  trailAmount: Number,
  quantity: Number,
  status: { type: String, enum: ['pending','triggered','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('PendingOrder', PendingOrderSchema);