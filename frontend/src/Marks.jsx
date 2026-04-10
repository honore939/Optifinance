import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsAPI, marksAPI } from './api'

function Marks() {
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState([])
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    totalMarks: '',
    term: 'Term 1',
    examDate: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const noStudents = !loading && students.length === 0

  const loadData = async () => {
    try {
      setLoading(true)
      const [studentsResult, marksResult] = await Promise.all([
        studentsAPI.getAll(),
        marksAPI.getAll()
      ])
      setStudents(studentsResult)
      setMarks(marksResult)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...formData,
        score: parseFloat(formData.score),
        totalMarks: parseFloat(formData.totalMarks),
        examDate: formData.examDate || new Date().toISOString().split('T')[0]
      }

      await marksAPI.create(payload)
      setSuccess('Mark recorded successfully.')
      setFormData({
        studentId: '',
        subject: '',
        score: '',
        totalMarks: '',
        term: 'Term 1',
        examDate: '',
        notes: ''
      })
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Record Student Marks</h1>
        <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="prediction-form">
          <h2>New Mark Entry</h2>

          {noStudents ? (
            <div className="error-message">
              No registered students found. Please register a student first.
              <button type="button" className="card-link" onClick={() => navigate('/register')}>
                Register Student
              </button>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="studentId">Student:</label>
              <select id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required>
                <option value="">Select a student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="score">Score:</label>
            <input type="number" id="score" name="score" value={formData.score} onChange={handleChange} min="0" step="0.1" required />
          </div>

          <div className="form-group">
            <label htmlFor="totalMarks">Total Marks:</label>
            <input type="number" id="totalMarks" name="totalMarks" value={formData.totalMarks} onChange={handleChange} min="1" step="0.1" required />
          </div>

          <div className="form-group">
            <label htmlFor="term">Term:</label>
            <input type="text" id="term" name="term" value={formData.term} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="examDate">Exam Date:</label>
            <input type="date" id="examDate" name="examDate" value={formData.examDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading || noStudents} className="predict-btn">
            {loading ? 'Saving...' : 'Save Marks'}
          </button>
          <button type="button" onClick={() => navigate('/view-marks')} className="card-link" style={{ marginLeft: '0.5rem', padding: '0.75rem 1.5rem' }}>
            View Marks
          </button>
        </form>
      </div>

      <div className="history-card">
        <h2>Recent Marks</h2>
        {loading ? (
          <p>Loading marks...</p>
        ) : marks.length === 0 ? (
          <p>No marks recorded yet.</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Total</th>
                  <th>Grade</th>
                  <th>Term</th>
                </tr>
              </thead>
              <tbody>
                {marks.map(mark => (
                  <tr key={mark._id}>
                    <td>{new Date(mark.examDate).toLocaleDateString()}</td>
                    <td>{mark.studentId?.name || 'Unknown'}</td>
                    <td>{mark.subject}</td>
                    <td>{mark.score}</td>
                    <td>{mark.totalMarks}</td>
                    <td>{mark.grade}</td>
                    <td>{mark.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marks
