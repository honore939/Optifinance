const express = require('express');
const { body, validationResult } = require('express-validator');
const Mark = require('../models/Mark');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

const validateMarkFields = [
  body('studentId').notEmpty().withMessage('Student is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('score').isFloat({ min: 0 }).withMessage('Score must be zero or higher'),
  body('totalMarks').isFloat({ min: 1 }).withMessage('Total marks must be at least 1')
];

const computeGrade = (score, totalMarks) => {
  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Create a mark record
router.post('/', auth, validateMarkFields, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { studentId, subject, score, totalMarks, grade, term, examDate, notes } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const computedGrade = grade || computeGrade(score, totalMarks);

    const mark = new Mark({
      studentId,
      subject,
      score,
      totalMarks,
      grade: computedGrade,
      term: term || 'Term 1',
      examDate: examDate ? new Date(examDate) : Date.now(),
      notes: notes || ''
    });

    await mark.save();
    res.status(201).json(mark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save mark' });
  }
});

// Get all marks
router.get('/', auth, async (req, res) => {
  try {
    const marks = await Mark.find().populate('studentId', 'name email');
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load marks' });
  }
});

// Get marks for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.params.studentId }).populate('studentId', 'name email');
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load student marks' });
  }
});

// Update a mark
router.put('/:id', auth, validateMarkFields, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { studentId, subject, score, totalMarks, term, examDate, notes } = req.body;

  try {
    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const computedGrade = computeGrade(score, totalMarks);

    await Mark.findByIdAndUpdate(req.params.id, {
      studentId,
      subject,
      score,
      totalMarks,
      grade: computedGrade,
      term: term || mark.term,
      examDate: examDate ? new Date(examDate) : mark.examDate,
      notes: notes || mark.notes
    }, { new: true, runValidators: true });

    const updatedMark = await Mark.findById(req.params.id).populate('studentId', 'name email');
    res.json(updatedMark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update mark' });
  }
});

// Delete a mark
router.delete('/:id', auth, async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.json({ message: 'Mark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete mark' });
  }
});

module.exports = router;
