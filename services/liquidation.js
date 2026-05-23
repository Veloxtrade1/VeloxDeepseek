const { enforceLiquidation } = require('./riskEngine');
async function startLiquidationMonitor() {
  setInterval(async () => {
    const users = await User.find();
    for (const user of users) {
      await enforceLiquidation(user._id);
    }
  }, 60000); // every minute
}
module.exports = { startLiquidationMonitor };