const crypto = require('crypto');

class MerkleTree {
  constructor(leaves) {
    this.leaves = leaves.map(leaf => MerkleTree.sha256Double(leaf));
    this.root = this.buildTree();
  }

  static sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static sha256Double(data) {
    return MerkleTree.sha256(MerkleTree.sha256(data));
  }

  buildTree() {
    let nodes = [...this.leaves];
    while (nodes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = nodes[i + 1] || left; // Duplicate if odd
        newLevel.push(MerkleTree.sha256Double(left + right));
      }
      nodes = newLevel;
    }
    return nodes[0];
  }

  getRootHash() {
    return this.root;
  }

  getProof(leafIndex) {
    // Simplified proof (full impl for prod)
    return [];
  }
}

module.exports = MerkleTree;
