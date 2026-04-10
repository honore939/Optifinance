const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentmanagement';

mongoose.connect(mongoUri)
  .then(() => {
    console.log(`MongoDB connected to ${mongoUri}`);

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/students', studentRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!' });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });