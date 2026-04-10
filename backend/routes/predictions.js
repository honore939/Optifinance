const express = require('express');
const { body, validationResult } = require('express-validator');
const Prediction = require('../models/Prediction');
const StudentPerformancePredictor = require('../predictPerformance');
const auth = require('../middleware/auth');

const router = express.Router();

const validatePredictionFields = [
  body('age').isInt({ min: 10, max: 120 }).withMessage('Age must be between 10 and 120'),
  body('attendance_rate').isFloat({ min: 0, max: 100 }).withMessage('Attendance rate must be between 0 and 100'),
  body('study_hours').isInt({ min: 0, max: 24 }).withMessage('Study hours must be between 0 and 24'),
  body('previous_gpa').isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4'),
  body('parent_education').notEmpty().withMessage('Parent education is required'),
  body('extracurricular').notEmpty().withMessage('Extracurricular field is required')
];

const buildGenerativeReport = (predictions) => {
  const total = predictions.length;
  const averageGrade = total
    ? Math.round(predictions.reduce((sum, item) => sum + item.predictedGrade, 0) / total)
    : 0;

  const categoryCounts = predictions.reduce((acc, item) => {
    acc[item.performanceCategory] = (acc[item.performanceCategory] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonCategory = sortedCategories.length ? sortedCategories[0][0] : 'N/A';

  const lastPrediction = predictions[0];
  const lastSummary = lastPrediction
    ? `Most recent prediction was ${lastPrediction.predictedGrade}/100 for ${lastPrediction.studentName || 'a student'} (${lastPrediction.performanceCategory}).`
    : 'There are no predictions yet.';

  const reportText = `Prediction history includes ${total} saved record${total === 1 ? '' : 's'} with an average predicted grade of ${averageGrade}. The most common category is ${mostCommonCategory}. ${lastSummary}`;

  return {
    total,
    averageGrade,
    categoryCounts,
    mostCommonCategory,
    lastPrediction,
    reportText
  };
};

// Save and return a prediction record
router.post('/', auth, validatePredictionFields, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const predictor = new StudentPerformancePredictor();
    const prediction = predictor.predict(req.body);

    const predictionRecord = new Prediction({
      studentId: req.body.studentId || null,
      studentName: req.body.studentName || '',
      studentEmail: req.body.studentEmail || '',
      age: req.body.age,
      attendance_rate: req.body.attendance_rate,
      study_hours: req.body.study_hours,
      previous_gpa: req.body.previous_gpa,
      parent_education: req.body.parent_education,
      extracurricular: req.body.extracurricular,
      predictedGrade: prediction.predictedGrade,
      performanceCategory: prediction.performanceCategory,
      recommendations: prediction.recommendations
    });

    await predictionRecord.save();

    res.status(201).json({ prediction: predictionRecord, reportSummary: prediction.recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Prediction save error' });
  }
});

// Get saved predictions
router.get('/', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load predictions' });
  }
});

// Get generative report for all saved predictions
router.get('/report', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    const report = buildGenerativeReport(predictions);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

module.exports = router;
