const mongoose = require('mongoose');
const SignalSchema = new mongoose.Schema({
  symbol: String,
  action: { type: String, enum: ['buy','sell'] },
  entryPrice: Number,
  tp1: Number,
  tp2: Number,
  sl: Number,
  confidence: Number,
  reasoning: String,
  source: { type: String, enum: ['ai','analyst'], default: 'ai' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Signal', SignalSchema);