const axios = require('axios');
const WebSocket = require('ws');
const API_KEY = process.env.TWELVE_DATA_API_KEY;
const symbolMap = {
  EURUSD: 'EUR/USD', GBPUSD: 'GBP/USD', XAUUSD: 'XAU/USD',
  BTCUSD: 'BTC/USD', SPX500: 'SPX', NAS100: 'NDX',
  UKOIL: 'UKOIL', ETHUSD: 'ETH/USD'
};
let cachedPrices = {
  EURUSD: 1.0850, GBPUSD: 1.2680, XAUUSD: 2320.5,
  BTCUSD: 62350, SPX500: 4500, NAS100: 15800,
  UKOIL: 82.5, ETHUSD: 3400
};
let ws = null, ioInstance = null;

async function refreshREST() {
  try {
    const symbols = Object.keys(symbolMap);
    const requests = symbols.map(sym => axios.get(`https://api.twelvedata.com/price?symbol=${symbolMap[sym]}&apikey=${API_KEY}`));
    const responses = await Promise.all(requests);
    symbols.forEach((sym, i) => {
      if (responses[i].data.price) cachedPrices[sym] = parseFloat(responses[i].data.price);
    });
  } catch (err) { console.error('REST error', err.message); }
}

function startWebSocketStream(io) {
  ioInstance = io;
  if (ws) return;
  ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes?apikey=${API_KEY}`);
  ws.on('open', () => {
    console.log('WebSocket connected');
    ws.send(JSON.stringify({ action: 'subscribe', symbols: Object.values(symbolMap) }));
  });
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.event === 'price') {
      const internalSym = Object.keys(symbolMap).find(k => symbolMap[k] === msg.symbol);
      if (internalSym && ioInstance) {
        cachedPrices[internalSym] = parseFloat(msg.price);
        ioInstance.emit('priceUpdate', { [internalSym]: cachedPrices[internalSym] });
        ioInstance.emit('orderbook', { symbol: internalSym, bids: [[cachedPrices[internalSym]-0.0005,10]], asks: [[cachedPrices[internalSym]+0.0005,10]] });
      }
    }
  });
  ws.on('error', (err) => console.error('WS error', err));
}

function getCurrentPrice(symbol) { return cachedPrices[symbol] || null; }
refreshREST();
setInterval(refreshREST, 30000);
module.exports = { getCurrentPrice, startWebSocketStream };