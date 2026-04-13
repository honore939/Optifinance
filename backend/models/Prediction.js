const mongoose = require('mongoose');
const { getHashableData } = require('../utils/hashData');
const MerkleTree = require('../utils/merkle');
const crypto = require('crypto');

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
  },
  dataHash: {
    type: String,
    required: true
  },
  merkleRoot: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

predictionSchema.pre('save', function(next) {
  if (this.isNew || this.isModified()) {
    // Compute dataHash (leaf)
    const serialData = getHashableData(this);
    this.dataHash = crypto.createHash('sha256').update(serialData).digest('hex');

    // Merkle tree with single leaf (double SHA256 root)
    const tree = new MerkleTree([serialData]);
    this.merkleRoot = tree.getRootHash();
  }
  next();
});

module.exports = mongoose.model('Prediction', predictionSchema);
