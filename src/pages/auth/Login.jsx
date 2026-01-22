import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { empId } = useParams();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || !password) {
      setError("Phone number and password are required");
      return;
    }

    try {
      setIsLoading(true);

      // 🔐 BACKEND LOGIN API 
      const response = await fetch("LOGIN_API_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empId,
          phoneNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Go to OTP page
      navigate(`/otp/${empId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-center login-container">
      <div className="card login-card">
        {/* HEADER */}
        <div className="login-header">
          <h2>Login</h2>
          <p>
            Employee ID: <strong>{empId}</strong>
          </p>
        </div>

        {/* ERROR */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <div className="login-button">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          © 2025 Your Company
        </div>
      </div>
    </div>
  );
};

export default Login;
