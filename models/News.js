const mongoose = require('mongoose');
const NewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  publishedAt: Date,
  source: String,
  sentiment: { type: String, enum: ['positive','negative','neutral'] },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('News', NewsSchema);