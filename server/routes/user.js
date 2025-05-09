const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/user');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router; 