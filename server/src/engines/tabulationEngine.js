/**
 * Tabulation Engine — Bottom-Up Dynamic Programming Iterative Matrix
 *
 * Time Complexity: O(n * r)
 * Space Complexity: O(n * r) DP table
 *
 * Fills the DP table row by row from base cases up to C(n, r).
 */
const { performance } = require('perf_hooks');

function computeTabulation(n, r) {
  if (r < 0 || r > n) {
    return {
      mode: 'tabulation',
      n,
      r,
      result: 0,
      executionTimeMs: 0,
      callCount: 0,
      cacheHits: 0,
      dpTable: []
    };
  }

  const startTime = performance.now();

  // Create DP matrix table (n+1) x (r+1) initialized to 0
  const dp = Array.from({ length: n + 1 }, () => new Array(r + 1).fill(0));
  let iterationCount = 0;

  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= Math.min(i, r); j++) {
      iterationCount++;
      if (j === 0 || j === i) {
        dp[i][j] = 1;
      } else {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      }
    }
  }

  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(3));

  return {
    mode: 'tabulation',
    n,
    r,
    result: dp[n][r],
    executionTimeMs,
    callCount: iterationCount,
    cacheHits: 0,
    dpTable: dp
  };
}

module.exports = { computeTabulation };
