const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  ensureProfile,
  getProfile,
  getAllUsers,
  updateProfile
} = require('../controllers/authController');

// Check if user profile exists or create one
router.post('/ensure-profile', ensureProfile);

// Get current user profile
router.get('/profile', getProfile);

// Get all users (admin)
router.get('/users', authenticate, getAllUsers);

// Update user profile
router.patch('/profile', authenticate, updateProfile);

module.exports = router;
