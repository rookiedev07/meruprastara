const express = require('express');
const router = express.Router();
const { getAnalytics, saveTriangle, getSavedTriangles } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/analytics', protect, adminOnly, getAnalytics);
router.post('/saved-triangles', protect, saveTriangle);
router.get('/saved-triangles', protect, getSavedTriangles);

module.exports = router;
