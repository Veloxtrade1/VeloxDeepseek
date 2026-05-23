const Alert = require('../models/Alert');
const { getCurrentPrice } = require('./marketData');
const { sendEmail } = require('./emailService');
const User = require('../models/User');

async function checkAlerts() {
  const alerts = await Alert.find({ triggered: false });
  for (const alert of alerts) {
    const price = getCurrentPrice(alert.symbol);
    if (!price) continue;
    let triggered = false;
    if (alert.condition === 'price_above' && price > alert.price) triggered = true;
    if (alert.condition === 'price_below' && price < alert.price) triggered = true;
    if (triggered) {
      alert.triggered = true;
      await alert.save();
      const user = await User.findById(alert.userId);
      sendEmail(user.email, `Price Alert: ${alert.symbol}`, `Price ${price} triggered your alert at ${alert.price}`);
    }
  }
}
module.exports = { checkAlerts };