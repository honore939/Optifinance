import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsAPI } from './api'

function ViewStudents({ students, setStudents }) {
  const [editingId, setEditingId] = useState(null)
  const [editFormData, setEditFormData] = useState({ name: '', email: '', age: '', grade: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await studentsAPI.getAll()
      setStudents(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (student) => {
    setEditingId(student._id)
    setEditFormData({ name: student.name, email: student.email, age: student.age, grade: student.grade })
  }

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedStudent = await studentsAPI.update(editingId, editFormData)
      setStudents(students.map(student =>
        student._id === editingId ? updatedStudent : student
      ))
      setEditingId(null)
      setEditFormData({ name: '', email: '', age: '', grade: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.delete(id)
        setStudents(students.filter(student => student._id !== id))
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData({ name: '', email: '', age: '', grade: '' })
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading students...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Student Records</h1>
        <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
      </header>
      <div className="students-container">
        {error && <div className="error-message">{error}</div>}
        {students.length === 0 ? (
          <div className="no-students">
            <p>No students registered yet.</p>
            <button onClick={() => navigate('/register')} className="register-link">Register First Student</button>
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  {editingId === student._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="age"
                          value={editFormData.age}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="grade"
                          value={editFormData.grade}
                          onChange={handleEditChange}
                          required
                        />
                      </td>
                      <td>
                        <button onClick={handleEditSubmit} className="save-btn">Save</button>
                        <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.age}</td>
                      <td>{student.grade}</td>
                      <td>
                        <button onClick={() => handleEdit(student)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(student._id)} className="delete-btn">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ViewStudents