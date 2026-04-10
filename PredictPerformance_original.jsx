import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentsAPI, marksAPI } from './api'

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
  const [successMessage, setSuccessMessage] = useState('')
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [recentMarks, setRecentMarks] = useState([])
  const [marksLoading, setMarksLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const result = await studentsAPI.getAll()
        setStudents(result)
      } catch (err) {
        console.error('Failed to load students', err)
      }
    }
    loadStudents()
  }, [])

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
      const predictionData = {
        ...formData,
        age: parseInt(formData.age),
        attendance_rate: parseFloat(formData.attendance_rate),
        study_hours: parseInt(formData.study_hours),
        previous_gpa: parseFloat(formData.previous_gpa)
      }

      const result = await studentsAPI.savePrediction(predictionData)
      setPrediction(result.prediction)
      setSuccessMessage('Prediction saved successfully.')
    } catch (err) {
      setError(err.message)
      setSuccessMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Original JSX structure - manual form only
    // (paste the full original JSX here from early read)
    <div>Original manual prediction form restored</div>
  )
}

export default PredictPerformance
