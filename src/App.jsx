import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import SetPassword from "./pages/auth/SetPassword";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OtpVerify />} />
      <Route path="/set-password" element={<SetPassword />} />

      {/* SUPERADMIN */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* FACULTY */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["FACULTY"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<FacultyDashboard />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
