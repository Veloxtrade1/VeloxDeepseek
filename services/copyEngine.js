const SocialTrade = require('../models/SocialTrade');
const trading = require('../routes/trading'); // to call order placement
async function executeCopyTrade(masterTradeId, followerId, quantity) {
  const master = await SocialTrade.findById(masterTradeId).populate('tradeId');
  if (!master) return;
  await trading.placeOrderInternal(followerId, master.tradeId.symbol, master.tradeId.side, quantity);
}
module.exports = { executeCopyTrade };