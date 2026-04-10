const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  grade: {
    type: String,
    trim: true,
    default: ''
  },
  term: {
    type: String,
    trim: true,
    default: 'Term 1'
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mark', markSchema);
