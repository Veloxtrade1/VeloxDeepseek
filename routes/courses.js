const express = require('express');
const Course = require('../models/Course');
const UserProgress = require('../models/UserProgress');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});
router.get('/:id/progress', auth, async (req, res) => {
  const progress = await UserProgress.findOne({ userId: req.user.id, courseId: req.params.id });
  res.json(progress || { completedLessons: [] });
});
router.post('/:id/lesson/:lessonId/complete', auth, async (req, res) => {
  let progress = await UserProgress.findOne({ userId: req.user.id, courseId: req.params.id });
  if (!progress) progress = new UserProgress({ userId: req.user.id, courseId: req.params.id, completedLessons: [] });
  if (!progress.completedLessons.includes(req.params.lessonId)) progress.completedLessons.push(req.params.lessonId);
  await progress.save();
  res.json({ msg: 'Lesson completed' });
});
module.exports = router;