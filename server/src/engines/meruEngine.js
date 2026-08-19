/**
 * Meru Engine — Reconstructs Piṅgala's Meru-Prastāra (Pascal's Triangle).
 * Row n contains (n + 1) entries corresponding to C(n, k) for k = 0 ... n.
 * Piṅgala's rule:
 * - First and last entries of each row are 1 (representing all light / all heavy syllables).
 * - Intermediate entries are the sum of the two entries directly above: C(n, k) = C(n-1, k-1) + C(n-1, k).
 */

function generateMeruTriangle(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('n must be a non-negative integer');
  }

  const rows = [];
  for (let i = 0; i <= n; i++) {
    const row = new Array(i + 1);
    row[0] = 1;
    row[i] = 1;

    for (let k = 1; k < i; k++) {
      row[k] = rows[i - 1][k - 1] + rows[i - 1][k];
    }
    rows.push(row);
  }

  return rows;
}

module.exports = { generateMeruTriangle };
