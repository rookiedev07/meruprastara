/**
 * Naive Recursive Engine — Computes C(n, r) via pure unoptimized recursion:
 * C(n, r) = C(n-1, r-1) + C(n-1, r)
 * Base cases: C(n, 0) = 1, C(n, n) = 1
 *
 * Demonstrates exponential time complexity O(2^n).
 */
const { performance } = require('perf_hooks');

function computeNaive(n, r, maxTreeDepth = 8) {
  if (r < 0 || r > n) {
    return {
      result: 0,
      executionTimeMs: 0,
      callCount: 0,
      cacheHits: 0,
      tree: null
    };
  }

  let callIdCounter = 0;
  let callCount = 0;
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

    // Store node if within max visual depth cap
    if (depth <= maxTreeDepth) {
      nodes.push(node);
    }

    if (currR === 0 || currR === currN) {
      node.isBaseCase = true;
      node.value = 1;
      return 1;
    }

    const leftVal = helper(currN - 1, currR - 1, depth + 1, id);
    const rightVal = helper(currN - 1, currR, depth + 1, id);
    const val = leftVal + rightVal;
    node.value = val;

    return val;
  }

  const startTime = performance.now();
  const result = helper(n, r);
  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(3));

  // Build tree structure from nodes array for visualizer
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
    mode: 'naive',
    n,
    r,
    result,
    executionTimeMs,
    callCount,
    cacheHits: 0,
    tree: treeHead || { id: 1, n, r, value: result, children: [] }
  };
}

module.exports = { computeNaive };
