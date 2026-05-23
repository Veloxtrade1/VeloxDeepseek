const { getCurrentPrice } = require('./marketData');
async function getOrderBook(symbol) {
  const price = getCurrentPrice(symbol);
  return {
    bids: [[price - 0.0005, 10], [price - 0.001, 20]],
    asks: [[price + 0.0005, 10], [price + 0.001, 20]]
  };
}
module.exports = { getOrderBook };