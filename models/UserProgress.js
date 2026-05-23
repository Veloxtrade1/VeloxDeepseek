const mongoose = require('mongoose');
const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
  quizScores: [{ lessonId: mongoose.Schema.Types.ObjectId, score: Number }],
  certificateIssued: Boolean
});
module.exports = mongoose.model('UserProgress', UserProgressSchema);