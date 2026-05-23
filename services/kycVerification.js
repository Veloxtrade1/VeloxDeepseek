const Kyc = require('../models/Kyc');
const User = require('../models/User');
async function verifyWithSumsub(kycId) {
  // call Sumsub API
  return { status: 'approved' };
}
module.exports = { verifyWithSumsub };