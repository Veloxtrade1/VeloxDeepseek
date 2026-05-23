const mongoose = require('mongoose');
const ApiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  key: { type: String, unique: true },
  secret: { type: String, unique: true },
  permissions: { type: [String], default: ['read'] },
  lastUsed: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ApiKey', ApiKeySchema);