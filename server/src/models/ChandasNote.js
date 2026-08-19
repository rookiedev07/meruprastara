const mongoose = require('mongoose');

const chandasNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['history', 'method', 'glossary'],
    default: 'history'
  },
  author: {
    type: String,
    default: 'Ācārya Piṅgala Research'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChandasNote', chandasNoteSchema);
