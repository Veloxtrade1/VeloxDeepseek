const mongoose = require('mongoose');
const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: String,
  condition: { type: String, enum: ['price_above', 'price_below'] },
  price: Number,
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Alert', AlertSchema);