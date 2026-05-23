module.exports = (req, res, next) => {
  const key = req.headers['admin-key'];
  if (key !== process.env.ADMIN_SECRET_KEY) return res.status(403).json({ msg: 'Forbidden' });
  next();
};