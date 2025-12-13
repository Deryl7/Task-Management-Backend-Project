const express = require('express');
const { createTask, getTasks } = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', createTask);
router.get('/', getTasks);

module.exports = router;