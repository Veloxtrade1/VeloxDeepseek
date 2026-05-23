const mongoose = require('mongoose');
const KycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  dob: Date,
  idType: { type: String, enum: ['passport','nationalId','driversLicense'] },
  idNumber: String,
  frontImage: String,
  backImage: String,
  selfieImage: String,
  proofOfAddress: String,
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  adminComment: String,
  verifiedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Kyc', KycSchema);