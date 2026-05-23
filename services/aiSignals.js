const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
async function generateSignal(symbol, price, rsi, macd) {
  const prompt = `Based on ${symbol} at ${price}, RSI ${rsi}, MACD ${macd}, give a trading signal (buy/sell) with entry, TP1, TP2, SL and confidence percentage.`;
  const response = await openai.createCompletion({ model: "text-davinci-003", prompt, max_tokens: 150 });
  return response.data.choices[0].text;
}
module.exports = { generateSignal };