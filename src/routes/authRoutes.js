const express = require('express');
const { register } = require('../controllers/authController');

const router = express.Router();

// Endpoint: POST /api/auth/register [cite: 78]
router.post('/register', register);

module.exports = router;