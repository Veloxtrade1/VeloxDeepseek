const mongoose = require('mongoose');
const LeverageProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symbol: String,
  leverage: Number,
  isDefault: { type: Boolean, default: false }
});
module.exports = mongoose.model('LeverageProfile', LeverageProfileSchema);