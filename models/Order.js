const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  side: { type: String, enum: ['buy','sell'] },
  type: { type: String, enum: ['market','limit','stop','stop_limit','trailing_stop'], default: 'market' },
  price: Number,
  quantity: Number,
  filledQuantity: { type: Number, default: 0 },
  status: { type: String, enum: ['pending','filled','cancelled','partial'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);