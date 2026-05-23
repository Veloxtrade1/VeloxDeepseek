const Position = require('../models/Position');
const { getCurrentPrice } = require('./marketData');

async function getRealTimePnL(userId) {
  const positions = await Position.find({ userId });
  let totalPnl = 0;
  for (const pos of positions) {
    const price = getCurrentPrice(pos.symbol);
    if (!price) continue;
    if (pos.side === 'buy') totalPnl += (price - pos.avgPrice) * pos.quantity;
    else totalPnl += (pos.avgPrice - price) * pos.quantity;
  }
  return totalPnl;
}
module.exports = { getRealTimePnL };