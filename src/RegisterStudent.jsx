import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsAPI } from './api'

function RegisterStudent({ setStudents }) {
  const [formData, setFormData] = useState({ name: '', email: '', age: '', grade: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const newStudent = await studentsAPI.create(formData)
      setStudents(prev => [...prev, newStudent])
      setFormData({ name: '', email: '', age: '', grade: '' })
      alert('Student registered successfully!')
      navigate('/students')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Register New Student</h1>
        <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
      </header>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="grade">Grade:</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterStudent