import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsAPI } from './api'

function PredictionHistory() {
  const [predictions, setPredictions] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loadPredictions = async () => {
    try {
      setLoading(true)
      const result = await studentsAPI.getPredictions()
      setPredictions(result)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadReport = async () => {
    try {
      const result = await studentsAPI.getPredictionReport()
      setReport(result)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadPredictions()
    loadReport()
  }, [])

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Saved Prediction History</h1>
        <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
      </header>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}

        {report && (
          <div className="report-card">
            <h2>Generated Report</h2>
            <p>{report.reportText}</p>
            <div className="report-summary-grid">
              <div>
                <strong>Total Records:</strong> {report.total}
              </div>
              <div>
                <strong>Average Grade:</strong> {report.averageGrade}
              </div>
              <div>
                <strong>Top Category:</strong> {report.mostCommonCategory}
              </div>
            </div>
          </div>
        )}

        <div className="history-card">
          <h2>Prediction Records</h2>
          {loading ? (
            <p>Loading saved predictions...</p>
          ) : predictions.length === 0 ? (
            <p>No prediction records found. Run a prediction to save one.</p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name / Email</th>
                    <th>Grade</th>
                    <th>Category</th>
                    <th>GPA</th>
                    <th>Attendance</th>
                    <th>Study Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((item) => (
                    <tr key={item._id}>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>{item.studentName || item.studentEmail || 'Anonymous student'}</td>
                      <td>{item.predictedGrade}</td>
                      <td>{item.performanceCategory}</td>
                      <td>{item.previous_gpa}</td>
                      <td>{item.attendance_rate}%</td>
                      <td>{item.study_hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PredictionHistory
