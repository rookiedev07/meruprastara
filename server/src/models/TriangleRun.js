const mongoose = require('mongoose');

const triangleRunSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  n: {
    type: Number,
    required: true
  },
  rows: {
    type: [[Number]],
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TriangleRun', triangleRunSchema);
