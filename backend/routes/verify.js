const express = require('express');
const Mark = require('../models/Mark');
const Prediction = require('../models/Prediction');
const { getHashableData } = require('../utils/hashData');
const crypto = require('crypto');
const MerkleTree = require('../utils/merkle');
const auth = require('../middleware/auth');

const router = express.Router();

// Verify single document hash
router.get('/:model/:id', auth, async (req, res) => {
  const { model, id } = req.params;
  try {
    let doc;
    if (model === 'marks') {
      doc = await Mark.findById(id);
    } else if (model === 'predictions') {
      doc = await Prediction.findById(id);
    } else {
      return res.status(400).json({ error: 'Invalid model: marks or predictions' });
    }

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Recompute
    const serialData = getHashableData(doc);
    const computedDataHash = crypto.createHash('sha256').update(serialData).digest('hex');
    const tree = new MerkleTree([serialData]);
    const computedMerkleRoot = tree.getRootHash();

    const isValid = doc.dataHash === computedDataHash && doc.merkleRoot === computedMerkleRoot;

    res.json({
      id,
      model,
      stored: { dataHash: doc.dataHash, merkleRoot: doc.merkleRoot },
      computed: { dataHash: computedDataHash, merkleRoot: computedMerkleRoot },
      valid: isValid,
      timestamp: doc.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
