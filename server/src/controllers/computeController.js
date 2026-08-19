const asyncHandler = require('express-async-handler');
const { runNaiveWithWorker } = require('../engines/naiveWorkerRunner');
const { computeMemo } = require('../engines/memoEngine');
const { computeTabulation } = require('../engines/tabulationEngine');
const Computation = require('../models/Computation');

// Helper to sanitize & validate inputs
function validateInputs(n, r) {
  const numN = parseInt(n, 10);
  const numR = parseInt(r, 10);

  if (isNaN(numN) || numN < 0) {
    throw new Error('n must be a non-negative integer.');
  }
  if (isNaN(numR) || numR < 0) {
    throw new Error('r must be a non-negative integer.');
  }
  if (numR > numN) {
    throw new Error(`r (${numR}) cannot be greater than n (${numN}). C(n,r) requires 0 <= r <= n.`);
  }

  return { n: numN, r: numR };
}

// @desc    Compute C(n,r) via Naive Recursion
// @route   POST /api/compute/naive
// @access  Public
const computeNaiveController = asyncHandler(async (req, res) => {
  const { n, r, maxTreeDepth } = req.body;
  const valid = validateInputs(n, r);

  if (valid.n > 30) {
    res.status(400);
    throw new Error('Naive recursive mode is capped at n <= 30 to prevent server hangs (O(2^n) time complexity). Use Memoized or Tabulation mode for larger n.');
  }

  try {
    const resultData = await runNaiveWithWorker(valid.n, valid.r, maxTreeDepth || 8, 3000);

    try {
      await Computation.create({
        n: valid.n,
        r: valid.r,
        mode: 'naive',
        resultValue: resultData.result,
        executionTimeMs: resultData.executionTimeMs,
        callCount: resultData.callCount,
        cacheHits: 0
      });
    } catch (dbErr) {
      // Non-blocking log
    }

    res.json({
      success: true,
      ...resultData
    });
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

// @desc    Compute C(n,r) via Top-Down Memoization
// @route   POST /api/compute/memo
// @access  Public
const computeMemoController = asyncHandler(async (req, res) => {
  const { n, r, maxTreeDepth } = req.body;
  const valid = validateInputs(n, r);

  if (valid.n > 60) {
    res.status(400);
    throw new Error('Top-down memoized mode is capped at n <= 60 for tree visualization.');
  }

  const resultData = computeMemo(valid.n, valid.r, maxTreeDepth || 20);

  try {
    await Computation.create({
      n: valid.n,
      r: valid.r,
      mode: 'memo',
      resultValue: resultData.result,
      executionTimeMs: resultData.executionTimeMs,
      callCount: resultData.callCount,
      cacheHits: resultData.cacheHits
    });
  } catch (dbErr) {
    // Non-blocking log
  }

  res.json({
    success: true,
    ...resultData
  });
});

// @desc    Compute C(n,r) via Bottom-Up Tabulation (DP Table)
// @route   POST /api/compute/tabulation
// @access  Public
const computeTabulationController = asyncHandler(async (req, res) => {
  const { n, r } = req.body;
  const valid = validateInputs(n, r);

  if (valid.n > 100) {
    res.status(400);
    throw new Error('Tabulation mode is capped at n <= 100 in this educational demo tool.');
  }

  const resultData = computeTabulation(valid.n, valid.r);

  try {
    await Computation.create({
      n: valid.n,
      r: valid.r,
      mode: 'tabulation',
      resultValue: resultData.result,
      executionTimeMs: resultData.executionTimeMs,
      callCount: resultData.callCount,
      cacheHits: 0
    });
  } catch (dbErr) {
    // Non-blocking log
  }

  res.json({
    success: true,
    ...resultData
  });
});

module.exports = {
  computeNaiveController,
  computeMemoController,
  computeTabulationController
};
