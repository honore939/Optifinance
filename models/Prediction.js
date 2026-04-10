const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: false
  },
  studentName: {
    type: String,
    trim: true,
    default: ''
  },
  studentEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  age: {
    type: Number,
    required: true
  },
  attendance_rate: {
    type: Number,
    required: true
  },
  study_hours: {
    type: Number,
    required: true
  },
  previous_gpa: {
    type: Number,
    required: true
  },
  parent_education: {
    type: String,
    trim: true,
    required: true
  },
  extracurricular: {
    type: String,
    trim: true,
    required: true
  },
  predictedGrade: {
    type: Number,
    required: true
  },
  performanceCategory: {
    type: String,
    required: true
  },
  recommendations: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);
