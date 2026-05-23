const { getCurrentPrice } = require('../services/marketData');
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected to market feed');
    const symbols = ['EURUSD','GBPUSD','XAUUSD','BTCUSD','SPX500','NAS100','UKOIL','ETHUSD'];
    const init = {};
    symbols.forEach(s => { init[s] = getCurrentPrice(s); });
    socket.emit('initPrices', init);
  });
};