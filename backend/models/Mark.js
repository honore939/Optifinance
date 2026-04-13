const mongoose = require('mongoose');
const { getHashableData } = require('../utils/hashData');
const MerkleTree = require('../utils/merkle');
const crypto = require('crypto');

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

markSchema.pre('save', function(next) {
  if (this.isNew || this.isModified()) {
    // Compute dataHash (leaf)
    const serialData = getHashableData(this);
    this.dataHash = crypto.createHash('sha256').update(serialData).digest('hex');

    // Merkle tree with single leaf (root = double SHA256 for now; extend for multi-leaves)
    const tree = new MerkleTree([serialData]);
    this.merkleRoot = tree.getRootHash();
  }
  next();
});

module.exports = mongoose.model('Mark', markSchema);
