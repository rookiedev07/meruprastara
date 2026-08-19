const express = require('express');
const router = express.Router();
const { compareBenchmark } = require('../controllers/benchmarkController');

router.post('/compare', compareBenchmark);

module.exports = router;
