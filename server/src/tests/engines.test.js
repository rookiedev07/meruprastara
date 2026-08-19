const { generateMeruTriangle } = require('../engines/meruEngine');
const { computeNaive } = require('../engines/naiveEngine');
const { computeMemo } = require('../engines/memoEngine');
const { computeTabulation } = require('../engines/tabulationEngine');

describe('Meru-Prastāra Algorithm Engines Unit Tests', () => {

  test('generateMeruTriangle generates correct rows up to n=4', () => {
    const rows = generateMeruTriangle(4);
    expect(rows.length).toBe(5);
    expect(rows[0]).toEqual([1]);
    expect(rows[1]).toEqual([1, 1]);
    expect(rows[2]).toEqual([1, 2, 1]);
    expect(rows[3]).toEqual([1, 3, 3, 1]);
    expect(rows[4]).toEqual([1, 4, 6, 4, 1]);
  });

  test('computeNaive calculates C(6, 3) = 20 correctly with call tree', () => {
    const res = computeNaive(6, 3);
    expect(res.result).toBe(20);
    expect(res.mode).toBe('naive');
    expect(res.callCount).toBeGreaterThan(20);
    expect(res.tree).toBeDefined();
    expect(res.tree.n).toBe(6);
    expect(res.tree.r).toBe(3);
  });

  test('computeMemo calculates C(10, 5) = 252 correctly with cache hits', () => {
    const res = computeMemo(10, 5);
    expect(res.result).toBe(252);
    expect(res.mode).toBe('memo');
    expect(res.cacheHits).toBeGreaterThan(0);
    expect(res.callCount).toBeLessThan(computeNaive(10, 5).callCount);
  });

  test('computeTabulation calculates C(12, 6) = 924 correctly', () => {
    const res = computeTabulation(12, 6);
    expect(res.result).toBe(924);
    expect(res.mode).toBe('tabulation');
    expect(res.dpTable.length).toBe(13);
    expect(res.dpTable[12][6]).toBe(924);
  });

  test('All three engines produce identical result for C(7, 3)', () => {
    const naiveRes = computeNaive(7, 3).result;
    const memoRes = computeMemo(7, 3).result;
    const tabRes = computeTabulation(7, 3).result;

    expect(naiveRes).toBe(35);
    expect(memoRes).toBe(35);
    expect(tabRes).toBe(35);
  });
});
