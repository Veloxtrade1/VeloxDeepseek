const Signal = require('../models/Signal');
async function backtestSignal(signalId) {
  // query historical price data, compare entry to actual movement
  return { win: true, profit: 150 };
}
module.exports = { backtestSignal };