const geoip = require('geoip-lite');
const blockedCountries = ['US', 'CA', 'GB', 'AU', 'JP', 'DE', 'FR', 'IN'];
module.exports = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);
  if (geo && blockedCountries.includes(geo.country)) {
    return res.status(403).json({ msg: 'Access denied from your location' });
  }
  next();
};