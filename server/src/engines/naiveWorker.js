const { parentPort, workerData } = require('worker_threads');
const { computeNaive } = require('./naiveEngine');

try {
  const { n, r, maxTreeDepth } = workerData;
  const output = computeNaive(n, r, maxTreeDepth);
  parentPort.postMessage({ success: true, data: output });
} catch (err) {
  parentPort.postMessage({ success: false, error: err.message });
}
