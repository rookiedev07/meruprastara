const asyncHandler = require('express-async-handler');
const { generateMeruTriangle } = require('../engines/meruEngine');
const TriangleRun = require('../models/TriangleRun');

// @desc    Generate Meru-Prastāra rows up to n
// @route   POST /api/meru/generate
// @access  Public
const generateMeru = asyncHandler(async (req, res) => {
  const { n } = req.body;

  const numN = parseInt(n, 10);
  if (isNaN(numN) || numN < 0) {
    res.status(400);
    throw new Error('n must be a non-negative integer.');
  }

  if (numN > 50) {
    res.status(400);
    throw new Error('For visual display and performance, n is capped at 50.');
  }

  const rows = generateMeruTriangle(numN);

  // Save run to DB if database is connected
  try {
    const triangleRun = new TriangleRun({
      userId: req.user ? req.user._id : null,
      n: numN,
      rows
    });
    await triangleRun.save();
  } catch (err) {
    // Non-blocking database logging warning
  }

  res.json({
    success: true,
    n: numN,
    rowCount: rows.length,
    rows
  });
});

module.exports = { generateMeru };
