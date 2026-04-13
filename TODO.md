# Blockchain Hashing + Merkle Tree Integration
Status: [ ] In Progress

## Steps:
1. ✅ Create backend/utils/merkle.js (MerkleTree class)
2. ✅ Create backend/utils/hashData.js (data serialization)
3. ✅ Update backend/models/Mark.js (add fields + pre-save hook)
4. ✅ Update backend/models/Prediction.js (add fields + pre-save hook)
5. ✅ Create backend/routes/verify.js (verification endpoint)
6. ✅ Update backend/server.js (mount /api/verify)
7. [ ] Test: Restart backend, POST mark/prediction via frontend/Postman, check DB hashes
8. [ ] Test verify endpoint
9. [ ] Complete - attempt_completion

Est. time: 10min
