const express = require('express');
const router = express.Router();
const {
  computeNaiveController,
  computeMemoController,
  computeTabulationController
} = require('../controllers/computeController');

router.post('/naive', computeNaiveController);
router.post('/memo', computeMemoController);
router.post('/tabulation', computeTabulationController);

module.exports = router;
