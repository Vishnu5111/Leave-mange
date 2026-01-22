import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SetPassword.css";

const SetPassword = () => {
 // const { empId } = useParams();
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* Password strength */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return Math.min(strength, 5);
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "#E7210B",
    "#FF9500",
    "#FFD700",
    "#2E8B57",
    "#28417B",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/set-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ empId, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to set password");
      }

      setSuccess("Password set successfully!");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-center set-password-container">
      <div className="card set-password-card">
        {/* HEADER */}
        <div className="set-password-header">
          <h2>Set Your Password</h2>
          
        </div>

        {/* ALERTS */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="form-group">
            <label>New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={`input ${error ? "input-error" : ""}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {password && strength > 0 && (
              <div className="strength-indicator">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(strength / 5) * 100}%`,
                      backgroundColor: strengthColors[strength - 1],
                    }}
                  />
                </div>
                <div
                  className="strength-text"
                  style={{ color: strengthColors[strength - 1] }}
                >
                  {strengthLabels[strength - 1]}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`input ${error ? "input-error" : ""}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {confirmPassword && (
              <div
                className={`match-indicator ${
                  password === confirmPassword
                    ? "match"
                    : "mismatch"
                }`}
              >
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            className="btn-primary submit-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Setting Password..." : "Set Password"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="set-password-footer">
          Password must be at least 8 characters
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
