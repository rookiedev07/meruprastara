const mongoose = require('mongoose');

const computationSchema = new mongoose.Schema({
  n: {
    type: Number,
    required: true
  },
  r: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    enum: ['naive', 'memo', 'tabulation'],
    required: true
  },
  resultValue: {
    type: Number,
    required: true
  },
  executionTimeMs: {
    type: Number,
    required: true
  },
  callCount: {
    type: Number,
    required: true
  },
  cacheHits: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Computation', computationSchema);
