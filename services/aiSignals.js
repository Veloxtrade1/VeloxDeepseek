// OpenAI removed – using mock signals
async function generateSignal(symbol, price, rsi, macd) {
  // Return a realistic but fake signal
  const actions = ['buy', 'sell'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const confidence = Math.floor(Math.random() * (95 - 60 + 1) + 60);
  
  const mockSignals = {
    buy: `Based on ${symbol} at ${price}, RSI (${rsi}) indicates oversold conditions. MACD shows bullish crossover. Recommended entry at ${price}. First target: ${(price * 1.01).toFixed(2)}. Second target: ${(price * 1.02).toFixed(2)}. Stop loss: ${(price * 0.99).toFixed(2)}. Confidence: ${confidence}%`,
    sell: `Based on ${symbol} at ${price}, RSI (${rsi}) indicates overbought conditions. MACD shows bearish divergence. Recommended entry at ${price}. First target: ${(price * 0.99).toFixed(2)}. Second target: ${(price * 0.98).toFixed(2)}. Stop loss: ${(price * 1.01).toFixed(2)}. Confidence: ${confidence}%`
  };
  
  return mockSignals[randomAction];
}

module.exports = { generateSignal };
