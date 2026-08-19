const express = require('express');
const router = express.Router();
const { generateMeru } = require('../controllers/meruController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/generate', optionalAuth, generateMeru);

module.exports = router;
