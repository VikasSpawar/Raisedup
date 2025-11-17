// routes/progress.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getCourseProgress,
  updateProgress,
  getAllUserProgress
} = require('../controllers/progressController');

// User route must come before ID route to avoid conflicts
router.get('/user', authenticate, getAllUserProgress);
router.post('/update', authenticate, updateProgress);
router.get('/:userId/:courseId', getCourseProgress);

module.exports = router;