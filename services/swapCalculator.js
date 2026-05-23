const SwapRate = require('../models/SwapRate');
const Position = require('../models/Position');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function applyDailySwap() {
  const positions = await Position.find();
  for (const pos of positions) {
    const rate = await SwapRate.findOne({ symbol: pos.symbol });
    if (!rate) continue;
    const swapAmount = (pos.side === 'buy' ? rate.longRate : rate.shortRate) * pos.quantity;
    const user = await User.findById(pos.userId);
    const newBalance = user.demoMode ? user.demoBalance - swapAmount : user.realBalance - swapAmount;
    if (user.demoMode) user.demoBalance = newBalance;
    else user.realBalance = newBalance;
    await user.save();
    await Transaction.create({ userId: pos.userId, type: 'swap', amount: -swapAmount, status: 'completed', metadata: { symbol: pos.symbol } });
  }
}
module.exports = { applyDailySwap };