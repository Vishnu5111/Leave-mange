import { useAuth } from "../../auth/AuthContext";
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="superadmin-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Super Admin Dashboard</h2>
        <p>
          System overview for <strong>{user?.employeeId}</strong>
        </p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Admins</h4>
          <span>5</span>
        </div>

        <div className="stat-card">
          <h4>Total Faculty</h4>
          <span>42</span>
        </div>

        <div className="stat-card">
          <h4>Total Leaves</h4>
          <span>120</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <h3>System Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">Manage Admins</button>
          <button className="action-btn">System Reports</button>
          <button className="action-btn">Audit Logs</button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
