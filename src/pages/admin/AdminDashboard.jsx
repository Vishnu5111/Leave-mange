import { useAuth } from "../../auth/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      {/* PAGE HEADER */}
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Welcome back, <strong>{user?.employeeId}</strong></p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Faculty</h4>
          <span>24</span>
        </div>

        <div className="stat-card">
          <h4>Pending Leave Requests</h4>
          <span>6</span>
        </div>

        <div className="stat-card">
          <h4>Approved Leaves</h4>
          <span>18</span>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">Approve Leave</button>
          <button className="action-btn">Manage Users</button>
          <button className="action-btn">View Reports</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
