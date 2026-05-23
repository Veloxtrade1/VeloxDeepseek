const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit','withdrawal','swap','commission'] },
  amount: Number,
  currency: { type: String, default: 'USD' },
  method: { type: String, enum: ['crypto','stripe','bank'], default: 'crypto' },
  status: { type: String, enum: ['pending','completed','failed'], default: 'pending' },
  txHash: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Transaction', TransactionSchema);