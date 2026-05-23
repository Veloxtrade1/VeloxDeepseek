const User = require('../models/User');
const Position = require('../models/Position');
const { getCurrentPrice } = require('./marketData');
const logger = require('../config/logger');

async function checkMargin(userId) {
  const user = await User.findById(userId);
  const positions = await Position.find({ userId });
  let usedMargin = 0;
  let unrealizedPL = 0;
  for (const pos of positions) {
    const price = getCurrentPrice(pos.symbol);
    if (!price) continue;
    const notional = pos.quantity * price;
    const leverage = user.leverage || 50;
    usedMargin += notional / leverage;
    if (pos.side === 'buy') unrealizedPL += (price - pos.avgPrice) * pos.quantity;
    else unrealizedPL += (pos.avgPrice - price) * pos.quantity;
  }
  const equity = user.balance + unrealizedPL;
  const marginLevel = usedMargin === 0 ? 0 : (equity / usedMargin) * 100;
  const freeMargin = equity - usedMargin;
  return { equity, usedMargin, freeMargin, marginLevel, unrealizedPL };
}

async function enforceLiquidation(userId) {
  const { marginLevel, equity, usedMargin } = await checkMargin(userId);
  if (marginLevel <= 20) {
    const positions = await Position.find({ userId });
    for (const pos of positions) {
      const price = getCurrentPrice(pos.symbol);
      if (!price) continue;
      const pnl = pos.side === 'buy' ? (price - pos.avgPrice) * pos.quantity : (pos.avgPrice - price) * pos.quantity;
      await User.findByIdAndUpdate(userId, { $inc: { demoBalance: pnl } });
      await pos.deleteOne();
      logger.info(`Liquidated position ${pos._id} for user ${userId}`);
    }
    await User.findByIdAndUpdate(userId, { demoBalance: equity });
    return { liquidated: true, remainingBalance: equity };
  }
  return { liquidated: false };
}

module.exports = { checkMargin, enforceLiquidation };