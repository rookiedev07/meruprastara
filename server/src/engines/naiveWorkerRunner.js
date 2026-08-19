const { Worker } = require('worker_threads');
const path = require('path');
const { computeNaive } = require('./naiveEngine');

/**
 * Executes naive recursion in a worker thread if n >= 18 to keep server responsive,
 * enforcing a strict execution timeout (default 3000ms).
 */
function runNaiveWithWorker(n, r, maxTreeDepth = 8, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    // For small n (< 18), compute synchronously for maximum efficiency
    if (n < 18) {
      try {
        const res = computeNaive(n, r, maxTreeDepth);
        return resolve(res);
      } catch (err) {
        return reject(err);
      }
    }

    // Safety guardrail for exponential explosive computations
    if (n > 30) {
      return reject(new Error('Input n exceeds maximum safety limit (n <= 30) for naive recursive mode.'));
    }

    const workerPath = path.join(__dirname, 'naiveWorker.js');
    const worker = new Worker(workerPath, {
      workerData: { n, r, maxTreeDepth }
    });

    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        worker.terminate();
        reject(new Error(`Naive recursive computation timed out after ${timeoutMs}ms (n=${n}, r=${r}). Select Memoized or Tabulated engine for large n.`));
      }
    }, timeoutMs);

    worker.on('message', (msg) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timer);
      if (msg.success) {
        resolve(msg.data);
      } else {
        reject(new Error(msg.error));
      }
    });

    worker.on('error', (err) => {
      if (isSettled) return;
      isSettled = true;
      clearTimeout(timer);
      reject(err);
    });

    worker.on('exit', (code) => {
      if (isSettled) return;
      if (code !== 0) {
        isSettled = true;
        clearTimeout(timer);
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

module.exports = { runNaiveWithWorker };
