import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <h3>LMS Dashboard</h3>

      <div className="header-right">
        <span className="role-badge">{user?.role}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
