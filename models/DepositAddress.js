const mongoose = require('mongoose');
const DepositAddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: String,
  network: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DepositAddress', DepositAddressSchema);