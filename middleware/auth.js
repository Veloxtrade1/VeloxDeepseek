const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ token, userId: decoded.user.id });
    if (!session || session.expiresAt < Date.now()) return res.status(401).json({ msg: 'Session expired' });
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};