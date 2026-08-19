const mongoose = require('mongoose');

const benchmarkComparisonSchema = new mongoose.Schema({
  n: {
    type: Number,
    required: true
  },
  r: {
    type: Number,
    required: true
  },
  results: [
    {
      mode: { type: String, required: true },
      executionTimeMs: { type: Number, required: true },
      callCount: { type: Number, required: true },
      cacheHits: { type: Number, default: 0 },
      resultValue: { type: Number, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BenchmarkComparison', benchmarkComparisonSchema);
