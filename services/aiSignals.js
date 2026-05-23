const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSignal(symbol, price, rsi, macd) {
  try {
    const prompt = `Based on ${symbol} at ${price}, RSI ${rsi}, MACD ${macd}, give a trading signal (buy/sell) with entry, TP1, TP2, SL and confidence percentage.`;
    
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    });
    
    return response.choices[0].text.trim();
  } catch (error) {
    console.error('OpenAI error:', error);
    return "Signal generation failed. Please try again later.";
  }
}

module.exports = { generateSignal };
