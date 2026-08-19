const asyncHandler = require('express-async-handler');
const { runNaiveWithWorker } = require('../engines/naiveWorkerRunner');
const { computeMemo } = require('../engines/memoEngine');
const { computeTabulation } = require('../engines/tabulationEngine');
const BenchmarkComparison = require('../models/BenchmarkComparison');

// @desc    Compare all three computation modes side-by-side
// @route   POST /api/benchmark/compare
// @access  Public
const compareBenchmark = asyncHandler(async (req, res) => {
  const { n, r } = req.body;

  const numN = parseInt(n, 10);
  const numR = parseInt(r, 10);

  if (isNaN(numN) || numN < 0 || isNaN(numR) || numR < 0) {
    res.status(400);
    throw new Error('n and r must be non-negative integers.');
  }

  if (numR > numN) {
    res.status(400);
    throw new Error(`r (${numR}) cannot be greater than n (${numN}).`);
  }

  const results = [];

  // 1. Naive Recursive (run only if n <= 25 to protect server responsiveness)
  let naiveMetric = null;
  if (numN <= 25) {
    try {
      const naiveRes = await runNaiveWithWorker(numN, numR, 6, 3000);
      naiveMetric = {
        mode: 'naive',
        executionTimeMs: naiveRes.executionTimeMs,
        callCount: naiveRes.callCount,
        cacheHits: 0,
        resultValue: naiveRes.result,
        skipped: false
      };
    } catch (err) {
      naiveMetric = {
        mode: 'naive',
        executionTimeMs: 0,
        callCount: 0,
        cacheHits: 0,
        resultValue: 0,
        skipped: true,
        skipReason: err.message
      };
    }
  } else {
    naiveMetric = {
      mode: 'naive',
      executionTimeMs: 0,
      callCount: 0,
      cacheHits: 0,
      resultValue: 0,
      skipped: true,
      skipReason: `Skipped for n=${numN} (n > 25) because naive recursion requires O(2^n) time and would hang the browser/server.`
    };
  }
  results.push(naiveMetric);

  // 2. Top-Down Memoized
  const memoRes = computeMemo(numN, numR, 10);
  results.push({
    mode: 'memo',
    executionTimeMs: memoRes.executionTimeMs,
    callCount: memoRes.callCount,
    cacheHits: memoRes.cacheHits,
    resultValue: memoRes.result,
    skipped: false
  });

  // 3. Bottom-Up Tabulation
  const tabRes = computeTabulation(numN, numR);
  results.push({
    mode: 'tabulation',
    executionTimeMs: tabRes.executionTimeMs,
    callCount: tabRes.callCount,
    cacheHits: 0,
    resultValue: tabRes.result,
    skipped: false
  });

  // Save benchmark record
  try {
    await BenchmarkComparison.create({
      n: numN,
      r: numR,
      results: results.filter(r => !r.skipped)
    });
  } catch (dbErr) {
    // Non-blocking log
  }

  res.json({
    success: true,
    n: numN,
    r: numR,
    expectedResult: memoRes.result,
    results
  });
});

module.exports = { compareBenchmark };
