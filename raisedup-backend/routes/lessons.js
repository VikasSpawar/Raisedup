// routes/lessons.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');

router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);
router.post('/', authenticate, createLesson);
router.patch('/:id', authenticate, updateLesson);
router.delete('/:id', authenticate, deleteLesson);

module.exports = router;




