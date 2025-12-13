const express = require('express');
const { createTag, getAllTags } = require('../controllers/tagController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/', createTag);
router.get('/', getAllTags);

module.exports = router;