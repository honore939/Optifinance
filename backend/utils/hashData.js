/**
 * Serialize document fields for hashing (exclude Mongo internals)
 */
function getHashableData(doc) {
  const { _id, __v, dataHash, merkleRoot, createdAt, updatedAt, ...hashable } = doc.toObject();
  return JSON.stringify(hashable, Object.keys(hashable).sort());
}

module.exports = { getHashableData };
