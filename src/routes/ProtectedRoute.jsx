import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


/**
 * ProtectedRoute
 * - Blocks unauthenticated users
 * - Restricts access based on roles (optional)
 *
 * Usage:
 * <ProtectedRoute allowedRoles={["ADMIN"]}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * <JUST FOr referenace>
 * <PRODCUTEDROUTE>
 * 
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // 🔐 Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login/EMP001" replace />;
  }
  

  // 🔒 Logged in but role not allowed → unauthorized
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
