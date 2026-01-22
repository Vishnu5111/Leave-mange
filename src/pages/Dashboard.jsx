import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // First-time login → force password setup
  if (user.firstLogin) {
    return <Navigate to="/set-password" replace />;
  }

  // Role-based redirect
  switch (user.role) {
    case "DEVELOPER":
      return <Navigate to="/dashboard/admin" replace />;

    case "SEMI_ADMIN":
      return <Navigate to="/dashboard/admin" replace />;

    case "FACULTY":
      return <Navigate to="/dashboard/faculty" replace />;

    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default Dashboard;
