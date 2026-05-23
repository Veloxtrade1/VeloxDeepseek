const mongoose = require('mongoose');
const SwapRateSchema = new mongoose.Schema({
  symbol: String,
  longRate: Number,
  shortRate: Number,
  effectiveDate: Date
});
module.exports = mongoose.model('SwapRate', SwapRateSchema);