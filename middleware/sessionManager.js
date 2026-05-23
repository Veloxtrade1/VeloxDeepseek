const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
async function createSession(userId, token, req) {
  const session = new Session({
    userId,
    token,
    deviceInfo: req.headers['user-agent'],
    ip: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  await session.save();
}
async function destroySession(token) {
  await Session.findOneAndDelete({ token });
}
module.exports = { createSession, destroySession };