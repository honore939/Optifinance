import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Welcome from './Welcome'
import RegisterStudent from './RegisterStudent'
import ViewStudents from './ViewStudents'
import PredictPerformance from './PredictPerformance'
import PredictionHistory from './PredictionHistory'
import Marks from './Marks'
import ViewMarks from './ViewMarks'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setStudents([])
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<Welcome onLogout={handleLogout} />} />
            <Route path="/register" element={<RegisterStudent students={students} setStudents={setStudents} />} />
            <Route path="/students" element={<ViewStudents students={students} setStudents={setStudents} />} />
            <Route path="/predict" element={<PredictPerformance />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/view-marks" element={<ViewMarks />} />
            <Route path="/predictions" element={<PredictionHistory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App
