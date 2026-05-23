const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  googleId: String,
  appleId: String,
  fullName: String,
  country: { type: String, enum: ['Pakistan','Bangladesh','Sri Lanka','Nepal','Bhutan','Maldives'] },
  demoMode: { type: Boolean, default: true },
  demoBalance: { type: Number, default: 100000 },
  realBalance: { type: Number, default: 0 },
  kycStatus: { type: String, enum: ['unverified','pending','verified','rejected'], default: 'unverified' },
  kycLevel: { type: Number, default: 1 },
  phone: String,
  address: String,
  twoFactorEnabled: { type: Boolean, default: false },
  totpSecret: String,
  resetToken: String,
  resetExpires: Date,
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
UserSchema.virtual('balance').get(function() {
  return this.demoMode ? this.demoBalance : this.realBalance;
});
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.methods.comparePassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};
module.exports = mongoose.model('User', UserSchema);