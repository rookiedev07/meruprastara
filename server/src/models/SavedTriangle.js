const mongoose = require('mongoose');

const savedTriangleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  n: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedTriangle', savedTriangleSchema);
