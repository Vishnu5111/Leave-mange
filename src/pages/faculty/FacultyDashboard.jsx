
import "./FacultyDashboard.css";

const FacultyDashboard = () => {
  

  return (
    <div className="faculty-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Faculty Dashboard</h2>
        <p>
         
        </p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Available Leaves</h4>
          <span>12</span>
        </div>

        <div className="stat-card">
          <h4>Pending Requests</h4>
          <span>2</span>
        </div>

        <div className="stat-card">
          <h4>Approved Leaves</h4>
          <span>8</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">Apply Leave</button>
          <button className="action-btn">My Leave History</button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
