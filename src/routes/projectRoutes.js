const express = require('express');
const { createProject, getAllProjects } = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

// CRUD Routes
router.post('/', createProject);
router.get('/', getAllProjects);

module.exports = router;