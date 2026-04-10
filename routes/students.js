const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student
router.post('/', auth, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('grade').notEmpty().withMessage('Grade is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, age, grade } = req.body;

  try {
    // Check if email exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    const student = new Student({ name, email, age, grade });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('grade').optional().notEmpty().withMessage('Grade cannot be empty')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Predict student performance
router.post('/predict', auth, async (req, res) => {
  try {
    const StudentPerformancePredictor = require('../predictPerformance');
    const predictor = new StudentPerformancePredictor();

    const prediction = predictor.predict(req.body);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Prediction error' });
  }
});

// Batch predict student performance
router.post('/predict-batch', auth, async (req, res) => {
  try {
    const StudentPerformancePredictor = require('../predictPerformance');
    const predictor = new StudentPerformancePredictor();

    const predictions = predictor.predictBatch(req.body.students || []);
    const statistics = predictor.getStatistics(predictions);

    res.json({
      predictions,
      statistics
    });
  } catch (error) {
    res.status(500).json({ message: 'Batch prediction error' });
  }
});

module.exports = router;