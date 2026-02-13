import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogOut, User } from "lucide-react";
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
      
      {/* Left Side */}
      <div className="header-left">
        <h3>LMS Dashboard</h3>
      </div>

      {/* Right Side */}
      <div className="header-right">
        
        <div className="user-info">
          <User size={18} />
          <span className="username">
            {user?.name || "User"}
          </span>
        </div>

        <span className="role-badge">
          {user?.role}
        </span>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
