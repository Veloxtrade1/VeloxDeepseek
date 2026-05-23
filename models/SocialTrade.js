const mongoose = require('mongoose');
const SocialTradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tradeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  profit: Number,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  copyTrades: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, quantity: Number }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('SocialTrade', SocialTradeSchema);