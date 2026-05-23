const express = require('express');
const router = express.Router();

// Simple keyword-based mock responses
const responses = {
  'hello': 'Hello! How can I help you with your trading today?',
  'price': 'You can check live prices on the trading dashboard. All prices are real-time from our data feed.',
  'deposit': 'To deposit funds, go to Dashboard → Deposit. We accept Bitcoin, USDT, and Ethereum.',
  'withdraw': 'Withdrawals can be requested from Dashboard → Withdraw. Minimum withdrawal is $10.',
  'kyc': 'KYC verification is required for deposits over $1000. Upload your documents in Dashboard → KYC.',
  'leverage': 'We offer leverage up to 1:2000. You can adjust leverage in account settings.',
  'support': 'Our support team is available 24/7. Contact us at support@velox.com',
  'default': 'Thank you for your message. Our team will assist you shortly. For urgent issues, email support@velox.com'
};

router.post('/ask', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ reply: "Please provide a message." });
  }
  
  const lowerMsg = message.toLowerCase();
  let reply = responses.default;
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMsg.includes(keyword)) {
      reply = response;
      break;
    }
  }
  
  res.json({ reply });
});

module.exports = router;
