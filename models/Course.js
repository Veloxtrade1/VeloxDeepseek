const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  level: { type: String, enum: ['beginner','intermediate','advanced'] },
  duration: Number,
  videoUrl: String,
  thumbnail: String,
  lessons: [{ title: String, content: String, videoUrl: String, duration: Number }],
  quiz: [{ question: String, options: [String], correct: Number }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Course', CourseSchema);