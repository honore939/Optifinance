import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { marksAPI } from './api'

function ViewMarks() {
  const [marks, setMarks] = useState([])
  const [filteredMarks, setFilteredMarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStudent, setFilterStudent] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [editingMark, setEditingMark] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  const loadMarks = async () => {
    try {
      setLoading(true)
      const result = await marksAPI.getAll()
      setMarks(result)
      setFilteredMarks(result)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMarks()
  }, [])

  useEffect(() => {
    let filtered = marks
    if (filterStudent) {
      filtered = filtered.filter(mark => mark.studentId?.name?.toLowerCase().includes(filterStudent.toLowerCase()))
    }
    if (filterSubject) {
      filtered = filtered.filter(mark => mark.subject?.toLowerCase().includes(filterSubject.toLowerCase()))
    }
    setFilteredMarks(filtered)
  }, [filterStudent, filterSubject, marks])

  const getPercentage = (score, total) => {
    return total > 0 ? Math.round((score / total) * 100) : 0
  }

  const calculateStudentStats = (studentId) => {
    const studentMarks = marks.filter(m => m.studentId?._id === studentId)
    if (studentMarks.length === 0) return null

    const totalScore = studentMarks.reduce((sum, m) => sum + m.score, 0)
    const totalMarks = studentMarks.reduce((sum, m) => sum + m.totalMarks, 0)
    const avgPercentage = getPercentage(totalScore, totalMarks)

    return {
      count: studentMarks.length,
      avgPercentage,
      totalScore,
      totalMarks
    }
  }

  const uniqueStudents = [...new Set(marks.map(m => m.studentId?._id))].filter(Boolean)

  const handleEdit = (mark) => {
    setEditingMark(mark)
  }

  const handleCloseEdit = () => {
    setEditingMark(null)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingMark) return

    setEditLoading(true)
    try {
      const updateData = {
        studentId: editingMark.studentId._id,
        subject: editingMark.subject,
        score: parseFloat(editingMark.score),
        totalMarks: parseFloat(editingMark.totalMarks),
        term: editingMark.term,
        examDate: editingMark.examDate,
        notes: editingMark.notes
      }

      await marksAPI.update(editingMark._id, updateData)
      await loadMarks()
      handleCloseEdit()
    } catch (err) {
      setError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteConfirm = (id) => {
    setDeleteConfirmId(id)
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return

    setDeleteLoading(true)
    try {
      await marksAPI.delete(deleteConfirmId)
      await loadMarks()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleteLoading(false)
      setDeleteConfirmId(null)
    }
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>View Student Marks</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/marks')} className="back-btn">Record Marks</button>
          <button onClick={() => navigate('/')} className="back-btn">Back to Dashboard</button>
        </div>
      </header>

      <div className="form-container">
        <div className="history-card">
          <h2>Filter Marks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="filterStudent">Student Name:</label>
              <input
                type="text"
                id="filterStudent"
                placeholder="Search by student name..."
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterSubject">Subject:</label>
              <input
                type="text"
                id="filterSubject"
                placeholder="Search by subject..."
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="history-card">
          <h2>Student Performance Summary</h2>
          {loading ? (
            <p>Loading marks...</p>
          ) : uniqueStudents.length === 0 ? (
            <p>No marks recorded yet.</p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Subjects Taken</th>
                    <th>Average %</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueStudents.map(studentId => {
                    const stats = calculateStudentStats(studentId)
                    const studentName = marks.find(m => m.studentId?._id === studentId)?.studentId?.name || 'Unknown'
                    return stats ? (
                      <tr key={studentId}>
                        <td>{studentName}</td>
                        <td>{stats.count}</td>
                        <td>{stats.avgPercentage}%</td>
                        <td>{stats.totalScore}/{stats.totalMarks}</td>
                      </tr>
                    ) : null
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="history-card">
          <h2>Detailed Marks ({filteredMarks.length})</h2>
          {loading ? (
            <p>Loading marks...</p>
          ) : filteredMarks.length === 0 ? (
            <p>No marks match your filter criteria.</p>
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
                    <th>%</th>
                    <th>Grade</th>
                    <th>Term</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarks.map(mark => (
                    <tr key={mark._id}>
                      <td>{new Date(mark.examDate).toLocaleDateString()}</td>
                      <td>{mark.studentId?.name || 'Unknown'}</td>
                      <td>{mark.subject}</td>
                      <td>{mark.score}</td>
                      <td>{mark.totalMarks}</td>
                      <td>{getPercentage(mark.score, mark.totalMarks)}%</td>
                      <td>{mark.grade}</td>
                      <td>{mark.term}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(mark)}
                          className="card-link"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteConfirm(mark._id)}
                          className="delete-btn"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingMark && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Edit Mark</h2>
              <button onClick={handleCloseEdit} className="close-btn">×</button>
            </header>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Student: {editingMark.studentId?.name}</label>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  value={editingMark.subject || ''}
                  onChange={(e) => setEditingMark({...editingMark, subject: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="score">Score:</label>
                <input
                  type="number"
                  id="score"
                  value={editingMark.score || ''}
                  onChange={(e) => setEditingMark({...editingMark, score: e.target.value})}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="totalMarks">Total Marks:</label>
                <input
                  type="number"
                  id="totalMarks"
                  value={editingMark.totalMarks || ''}
                  onChange={(e) => setEditingMark({...editingMark, totalMarks: e.target.value})}
                  min="1"
                  step="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="term">Term:</label>
                <input
                  type="text"
                  id="term"
                  value={editingMark.term || ''}
                  onChange={(e) => setEditingMark({...editingMark, term: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="examDate">Exam Date:</label>
                <input
                  type="date"
                  id="examDate"
                  value={editingMark.examDate ? new Date(editingMark.examDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingMark({...editingMark, examDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes:</label>
                <textarea
                  id="notes"
                  value={editingMark.notes || ''}
                  onChange={(e) => setEditingMark({...editingMark, notes: e.target.value})}
                  rows="3"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseEdit} className="back-btn">Cancel</button>
                <button type="submit" disabled={editLoading} className="predict-btn">
                  {editLoading ? 'Saving...' : 'Update Mark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Confirm Delete</h2>
              <button onClick={handleDeleteCancel} className="close-btn">×</button>
            </header>
            <p>Are you sure you want to delete this mark? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleDeleteCancel} className="back-btn">Cancel</button>
              <button 
                onClick={handleDelete} 
                disabled={deleteLoading} 
                className="delete-btn"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Mark'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }
        .close-btn:hover {
          color: #000;
        }
        .delete-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
        .delete-btn:hover:not(:disabled) {
          background-color: #c82333;
        }
        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default ViewMarks

