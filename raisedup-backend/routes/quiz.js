// routes/quiz.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getQuizByCourse,
  submitQuiz,
  getUserQuizResults,
  createQuiz
} = require('../controllers/quizController');

router.get('/course/:courseId', getQuizByCourse);
router.post('/submit', authenticate, submitQuiz);
router.get('/results', authenticate, getUserQuizResults);
router.post('/', authenticate, createQuiz);

module.exports = router;