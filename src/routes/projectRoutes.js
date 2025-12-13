const express = require('express');
const { createProject, getAllProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

// CRUD Routes
router.post('/', createProject);
router.get('/', getAllProjects);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;