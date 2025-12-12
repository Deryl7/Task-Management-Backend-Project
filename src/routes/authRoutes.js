const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Endpoint: POST /api/auth/register [cite: 78]
router.post('/register', register);
// Endpoint: POST /api/auth/login [cite: 79]
router.post('/login', login);
// Endpoint: GET /api/auth/me [cite: 80]
router.get('/me', authenticate, getMe);

module.exports = router;