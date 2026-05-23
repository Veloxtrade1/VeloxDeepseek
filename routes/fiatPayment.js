const express = require('express');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.post('/deposit', auth, async (req, res) => {
  const { amount } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Velox Deposit' }, unit_amount: amount * 100 }, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/dashboard/deposits?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/dashboard/deposits?cancel=true`,
    metadata: { userId: req.user.id, amount }
  });
  res.json({ url: session.url });
});
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const amount = parseInt(session.metadata.amount);
    const user = await User.findById(userId);
    if (!user.demoMode) user.realBalance += amount;
    else user.demoBalance += amount;
    await user.save();
    await Transaction.create({ userId, type: 'deposit', amount, method: 'stripe', status: 'completed' });
  }
  res.json({ received: true });
});
module.exports = router;