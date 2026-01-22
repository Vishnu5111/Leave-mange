import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import SetPassword from "./pages/auth/SetPassword";

function App() {
  return (
    <Routes>
      {/* 🔓 Public Auth Pages */}
      <Route path="/login/:empId" element={<Login />} />
      <Route path="/otp/:empId" element={<OtpVerify />} />
      <Route path="/set-password" element={<SetPassword />} />
    </Routes>
  );
}

export default App;
