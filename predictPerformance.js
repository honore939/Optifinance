/**
 * Student Performance Prediction Module
 * Uses conditional logic to predict student performance based on various factors
 */

class StudentPerformancePredictor {
  constructor() {
    // Define performance thresholds and weights
    this.thresholds = {
      excellent: { min: 90, factors: { attendance: 95, studyHours: 8, gpa: 3.5 } },
      good: { min: 80, factors: { attendance: 90, studyHours: 6, gpa: 3.0 } },
      average: { min: 70, factors: { attendance: 85, studyHours: 5, gpa: 2.5 } },
      belowAverage: { min: 60, factors: { attendance: 80, studyHours: 4, gpa: 2.0 } }
    };

    this.weights = {
      attendance: 0.3,
      studyHours: 0.25,
      gpa: 0.25,
      age: 0.1,
      extracurricular: 0.1
    };
  }

  /**
   * Predict student performance based on input data
   * @param {Object} studentData - Student information
   * @returns {Object} Prediction result with grade and category
   */
  predict(studentData) {
    const {
      age,
      attendance_rate = 0,
      study_hours = 0,
      previous_gpa = 0,
      parent_education = 'Unknown',
      extracurricular = 'None'
    } = studentData;

    // Calculate weighted score
    let score = 0;

    // Attendance factor (0-100)
    score += (attendance_rate / 100) * this.weights.attendance * 100;

    // Study hours factor (assuming max 12 hours)
    score += Math.min(study_hours / 12, 1) * this.weights.studyHours * 100;

    // GPA factor (assuming 4.0 scale)
    score += (previous_gpa / 4.0) * this.weights.gpa * 100;

    // Age factor (optimal age around 16-18)
    const ageFactor = age >= 16 && age <= 18 ? 1 : age >= 14 && age <= 20 ? 0.8 : 0.6;
    score += ageFactor * this.weights.age * 100;

    // Extracurricular factor
    const extracurricularFactor = extracurricular !== 'None' ? 1 : 0.7;
    score += extracurricularFactor * this.weights.extracurricular * 100;

    // Parent education bonus
    const educationLevels = {
      'High School': 0.8,
      'Associate': 0.9,
      'Bachelor': 1.0,
      'Master': 1.1,
      'Doctorate': 1.2,
      'Unknown': 0.9
    };
    const educationMultiplier = educationLevels[parent_education] || 0.9;
    score *= educationMultiplier;

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine category
    let category = 'Needs Improvement';
    if (score >= this.thresholds.excellent.min) {
      category = 'Excellent';
    } else if (score >= this.thresholds.good.min) {
      category = 'Good';
    } else if (score >= this.thresholds.average.min) {
      category = 'Average';
    } else if (score >= this.thresholds.belowAverage.min) {
      category = 'Below Average';
    }

    return {
      predictedGrade: Math.round(score),
      performanceCategory: category,
      factors: {
        attendance: attendance_rate,
        studyHours: study_hours,
        gpa: previous_gpa,
        age: age,
        extracurricular: extracurricular,
        parentEducation: parent_education
      },
      recommendations: this.getRecommendations(score, studentData)
    };
  }

  /**
   * Get personalized recommendations based on prediction
   * @param {number} score - Predicted score
   * @param {Object} studentData - Student data
   * @returns {Array} List of recommendations
   */
  getRecommendations(score, studentData) {
    const recommendations = [];

    if (studentData.attendance_rate < 85) {
      recommendations.push('Improve attendance - aim for 90% or higher');
    }

    if (studentData.study_hours < 6) {
      recommendations.push('Increase study hours to at least 6 hours per day');
    }

    if (studentData.previous_gpa < 2.5) {
      recommendations.push('Focus on improving GPA through additional tutoring');
    }

    if (studentData.extracurricular === 'None') {
      recommendations.push('Consider joining extracurricular activities for better development');
    }

    if (score < 70) {
      recommendations.push('Seek academic counseling and create a study plan');
    }

    if (recommendations.length === 0) {
      recommendations.push('Keep up the excellent work! Maintain current study habits.');
    }

    return recommendations;
  }

  /**
   * Batch predict for multiple students
   * @param {Array} studentsData - Array of student data objects
   * @returns {Array} Array of prediction results
   */
  predictBatch(studentsData) {
    return studentsData.map(student => ({
      ...student,
      prediction: this.predict(student)
    }));
  }

  /**
   * Get performance statistics for a group of students
   * @param {Array} predictions - Array of prediction results
   * @returns {Object} Statistics object
   */
  getStatistics(predictions) {
    const categories = {};
    const grades = predictions.map(p => p.prediction.predictedGrade);

    predictions.forEach(pred => {
      const cat = pred.prediction.performanceCategory;
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return {
      totalStudents: predictions.length,
      averageGrade: Math.round(grades.reduce((a, b) => a + b, 0) / grades.length),
      categoryDistribution: categories,
      highestGrade: Math.max(...grades),
      lowestGrade: Math.min(...grades)
    };
  }
}

// Sample data for testing
const sampleStudents = [
  {
    name: 'Alice Johnson',
    age: 16,
    attendance_rate: 95,
    study_hours: 8,
    previous_gpa: 3.5,
    parent_education: 'Bachelor',
    extracurricular: 'Sports'
  },
  {
    name: 'Bob Smith',
    age: 17,
    attendance_rate: 80,
    study_hours: 5,
    previous_gpa: 2.8,
    parent_education: 'High School',
    extracurricular: 'None'
  },
  {
    name: 'Charlie Brown',
    age: 15,
    attendance_rate: 92,
    study_hours: 7,
    previous_gpa: 3.2,
    parent_education: 'Master',
    extracurricular: 'Music'
  }
];

// Export for use in other modules
module.exports = StudentPerformancePredictor;

// Example usage (uncomment to test)
/*
const predictor = new StudentPerformancePredictor();

console.log('Individual Predictions:');
sampleStudents.forEach(student => {
  const result = predictor.predict(student);
  console.log(`${student.name}: ${result.predictedGrade} (${result.performanceCategory})`);
  console.log('Recommendations:', result.recommendations);
  console.log('---');
});

console.log('Batch Predictions:');
const batchResults = predictor.predictBatch(sampleStudents);
console.log(batchResults);

console.log('Statistics:');
const stats = predictor.getStatistics(batchResults);
console.log(stats);
*/