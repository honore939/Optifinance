import { Link } from 'react-router-dom'

function Welcome({ onLogout }) {
  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1>Welcome to Student Management System</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>
      <div className="welcome-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Register Student</h3>
            <p>Add new students to the system</p>
            <Link to="/register" className="card-link">Go to Register</Link>
          </div>
          <div className="dashboard-card">
            <h3>View Students</h3>
            <p>View, update, and delete student records</p>
            <Link to="/students" className="card-link">Go to Students</Link>
          </div>
          <div className="dashboard-card">
            <h3>Predict Performance</h3>
            <p>Predict student performance based on various factors</p>
            <Link to="/predict" className="card-link">Go to Prediction</Link>
          </div>
          <div className="dashboard-card">
            <h3>Record Student Marks</h3>
            <p>Enter exam results and save marks for each student</p>
            <Link to="/marks" className="card-link">Go to Marks</Link>
          </div>
          <div className="dashboard-card">
            <h3>View Student Marks</h3>
            <p>Browse and filter recorded marks by student or subject</p>
            <Link to="/view-marks" className="card-link">View Marks</Link>
          </div>
          <div className="dashboard-card">
            <h3>Prediction History</h3>
            <p>View past performance predictions</p>
            <Link to="/predictions" className="card-link">View Predictions</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome