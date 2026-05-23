const axios = require('axios');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const logger = require('../config/logger');

async function confirmBitcoinTransaction(txHash, amount, userId) {
  const url = `https://api.blockcypher.com/v1/btc/main/txs/${txHash}?token=${process.env.BLOCKCYPHER_TOKEN}`;
  try {
    const res = await axios.get(url);
    if (res.data.confirmations >= 2) {
      await Transaction.findOneAndUpdate({ txHash }, { status: 'completed' });
      const user = await User.findById(userId);
      if (!user.demoMode) {
        user.realBalance += amount;
        await user.save();
      }
      logger.info(`Deposit confirmed: ${txHash} for user ${userId}`);
      return true;
    }
    return false;
  } catch (err) {
    logger.error(`BlockCypher error: ${err.message}`);
    return false;
  }
}
module.exports = { confirmBitcoinTransaction };