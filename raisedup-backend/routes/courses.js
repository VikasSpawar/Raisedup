const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticate, createCourse);
router.patch('/:id', authenticate, updateCourse);
router.delete('/:id', authenticate, deleteCourse);

module.exports = router;
