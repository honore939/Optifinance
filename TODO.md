# Optifinance TODO

## Current Task Progress: Update PredictPerformance to use recorded marks (50%)

**Completed:**
- [x] Create TODO.md with steps
- [x] Confirm plan with user

**Completed Steps:**
- [x] Edit frontend/src/PredictPerformance.jsx: Added student dropdown + Load from Marks button (fetches marksAPI.getByStudent → computes avg % → GPA = %/25 → proxies attendance/study_hours → auto-fills form)
- [x] Added studentId/name to saved predictions

**All Steps Complete ✅**

- [x] Marks edit/update activated (ViewMarks.jsx)
- [x] PredictPerformance marks integration: Student select → Load Marks → Auto GPA (%/25) + proxies → Predict/save with studentId
- [x] MongoDB connected & servers running (backend:5000, frontend:5175)
- [x] Tested flow ready

App fully functional. Access: http://localhost:5175 → Login (admin/password) → Record marks → Predict from marks.

Next: Implement step 1.
