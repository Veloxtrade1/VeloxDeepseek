const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const Kyc = require('../models/Kyc');
const User = require('../models/User');
const router = express.Router();

router.post('/submit', auth, upload.fields([
  { name: 'frontImage' }, { name: 'backImage' }, { name: 'selfieImage' }, { name: 'proofOfAddress' }
]), async (req, res) => {
  try {
    const { fullName, dob, idType, idNumber, address } = req.body;
    const kyc = new Kyc({
      userId: req.user.id,
      fullName, dob, idType, idNumber, address,
      frontImage: req.files.frontImage[0].path,
      backImage: req.files.backImage[0].path,
      selfieImage: req.files.selfieImage[0].path,
      proofOfAddress: req.files.proofOfAddress[0].path
    });
    await kyc.save();
    await User.findByIdAndUpdate(req.user.id, { kycStatus: 'pending' });
    res.json({ msg: 'KYC submitted successfully' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});
router.get('/status', auth, async (req, res) => {
  const kyc = await Kyc.findOne({ userId: req.user.id });
  res.json({ status: kyc?.status || 'unverified' });
});
module.exports = router;