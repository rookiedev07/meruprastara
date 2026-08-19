/**
 * Memoized Engine — Top-Down Recursion with Cache Table memo[n][r]
 *
 * Time Complexity: O(n * r)
 * Space Complexity: O(n * r) + stack depth O(n)
 *
 * Tracks every subproblem call, marking whether it was a fresh computation or a cache hit.
 */
const { performance } = require('perf_hooks');

function computeMemo(n, r, maxTreeDepth = 20) {
  if (r < 0 || r > n) {
    return {
      mode: 'memo',
      n,
      r,
      result: 0,
      executionTimeMs: 0,
      callCount: 0,
      cacheHits: 0,
      tree: null,
      memoTable: []
    };
  }

  // Initialize memo table (n+1) x (r+1) filled with null
  const memo = Array.from({ length: n + 1 }, () => new Array(r + 1).fill(null));

  let callIdCounter = 0;
  let callCount = 0;
  let cacheHits = 0;
  const nodes = [];

  function helper(currN, currR, depth = 0, parentId = null) {
    callCount++;
    const id = ++callIdCounter;

    const node = {
      id,
      parentId,
      n: currN,
      r: currR,
      depth,
      isBaseCase: false,
      isCacheHit: false,
      value: null,
      children: []
    };

    if (depth <= maxTreeDepth) {
      nodes.push(node);
    }

    // Check memoization cache
    if (memo[currN][currR] !== null) {
      cacheHits++;
      node.isCacheHit = true;
      node.value = memo[currN][currR];
      return memo[currN][currR];
    }

    // Base cases
    if (currR === 0 || currR === currN) {
      node.isBaseCase = true;
      node.value = 1;
      memo[currN][currR] = 1;
      return 1;
    }

    // Recursive computation
    const leftVal = helper(currN - 1, currR - 1, depth + 1, id);
    const rightVal = helper(currN - 1, currR, depth + 1, id);
    const val = leftVal + rightVal;

    memo[currN][currR] = val;
    node.value = val;

    return val;
  }

  const startTime = performance.now();
  const result = helper(n, r);
  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(3));

  // Reconstruct hierarchy tree for D3 visualizer
  const nodeMap = {};
  let treeHead = null;

  nodes.forEach(node => {
    nodeMap[node.id] = { ...node, children: [] };
  });

  nodes.forEach(node => {
    if (node.parentId === null) {
      treeHead = nodeMap[node.id];
    } else if (nodeMap[node.parentId]) {
      nodeMap[node.parentId].children.push(nodeMap[node.id]);
    }
  });

  return {
    mode: 'memo',
    n,
    r,
    result,
    executionTimeMs,
    callCount,
    cacheHits,
    tree: treeHead || { id: 1, n, r, value: result, children: [] },
    memoTable: memo
  };
}

module.exports = { computeMemo };
