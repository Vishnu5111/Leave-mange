import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

/**
 * ProtectedRoute
 * - Blocks unauthenticated users
 * - Restricts access based on allowed roles
 *
 * Usage:
 * <ProtectedRoute allowedRoles={["ADMIN"]}>
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 🔐 Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔒 Logged in but role not allowed → unauthorized
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access allowed
  return children;
};

export default ProtectedRoute;
