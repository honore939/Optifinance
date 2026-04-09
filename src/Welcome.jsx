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
        </div>
      </div>
    </div>
  )
}

export default Welcome