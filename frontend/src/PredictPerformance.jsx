import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsAPI } from './api'

function PredictPerformance() {
  const [formData, setFormData] = useState({
    age: '',
    attendance_rate: '',
    study_hours: '',
    previous_gpa: '',
    parent_education: 'Bachelor',
    extracurricular: 'None'
  })
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Convert string values to numbers where needed
      const predictionData = {
        ...formData,
        age: parseInt(formData.age),
        attendance_rate: parseFloat(formData.attendance_rate),
        study_hours: parseInt(formData.study_hours),
        previous_gpa: parseFloat(formData.previous_gpa)
      }

      const result = await studentsAPI.predictPerformance(predictionData)
      setPrediction(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Student Performance Prediction</h1>
        <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="prediction-form">
          <h2>Enter Student Information</h2>

          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="10"
              max="25"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="attendance_rate">Attendance Rate (%):</label>
            <input
              type="number"
              id="attendance_rate"
              name="attendance_rate"
              value={formData.attendance_rate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="study_hours">Study Hours per Day:</label>
            <input
              type="number"
              id="study_hours"
              name="study_hours"
              value={formData.study_hours}
              onChange={handleChange}
              min="0"
              max="24"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="previous_gpa">Previous GPA (0-4.0):</label>
            <input
              type="number"
              id="previous_gpa"
              name="previous_gpa"
              value={formData.previous_gpa}
              onChange={handleChange}
              min="0"
              max="4.0"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="parent_education">Parent Education:</label>
            <select
              id="parent_education"
              name="parent_education"
              value={formData.parent_education}
              onChange={handleChange}
            >
              <option value="High School">High School</option>
              <option value="Associate">Associate Degree</option>
              <option value="Bachelor">Bachelor's Degree</option>
              <option value="Master">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="extracurricular">Extracurricular Activities:</label>
            <select
              id="extracurricular"
              name="extracurricular"
              value={formData.extracurricular}
              onChange={handleChange}
            >
              <option value="None">None</option>
              <option value="Sports">Sports</option>
              <option value="Music">Music</option>
              <option value="Arts">Arts</option>
              <option value="Clubs">Clubs</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="predict-btn">
            {loading ? 'Predicting...' : 'Predict Performance'}
          </button>
        </form>

        {prediction && (
          <div className="prediction-result">
            <h2>Prediction Result</h2>
            <div className="result-card">
              <div className="predicted-grade">
                <h3>Predicted Grade: {prediction.predictedGrade}/100</h3>
                <span className={`category ${prediction.performanceCategory.toLowerCase().replace(' ', '-')}`}>
                  {prediction.performanceCategory}
                </span>
              </div>

              <div className="factors">
                <h4>Based on:</h4>
                <ul>
                  <li>Age: {prediction.factors.age}</li>
                  <li>Attendance: {prediction.factors.attendance}%</li>
                  <li>Study Hours: {prediction.factors.studyHours}/day</li>
                  <li>Previous GPA: {prediction.factors.gpa}</li>
                  <li>Parent Education: {prediction.factors.parentEducation}</li>
                  <li>Extracurricular: {prediction.factors.extracurricular}</li>
                </ul>
              </div>

              <div className="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PredictPerformance