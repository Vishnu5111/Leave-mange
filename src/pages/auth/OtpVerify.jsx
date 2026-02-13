import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./OtpVerify.css";

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

const OtpVerify = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    startTimer();
    inputRefs.current[0]?.focus();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(RESEND_TIME);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.split("");
    const nextOtp = Array(OTP_LENGTH).fill("");
    digits.forEach((d, i) => (nextOtp[i] = d));
    setOtp(nextOtp);

    inputRefs.current[Math.min(digits.length - 1, OTP_LENGTH - 1)]?.focus();
  };

const handleVerifyOtp = async () => {
  if (otp.some((d) => d === "")) {
    setError("Please enter complete OTP");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const enteredOtp = otp.join("");
    const otpToken = sessionStorage.getItem("otpToken");

    if (!otpToken) {
      throw new Error("OTP session expired. Please login again.");
    }

    const response = await fetch(
      `http://localhost:9090/verify-otp?enteredOtp=${enteredOtp}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${otpToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid OTP");
    }

    // 🔐 Build dynamic user object
    const userData = {
      role: data.role,
      employeeId: data.employeeId,
    };

    // Add hierarchy fields only when needed
    if (data.role === "FACULTY" && data.adminId) {
      userData.adminId = data.adminId;
    }

    if (data.role === "ADMIN" && data.superAdminId) {
      userData.superAdminId = data.superAdminId;
    }

    // ✅ Store in AuthContext
    handleLoginSuccess(otpToken, userData);

    // Clear temp token
    sessionStorage.removeItem("otpToken");

    // 🔁 Role-based redirect (clean switch)
    switch (data.role) {
      case "SUPERADMIN":
        navigate("/superadmin/dashboard");
        break;
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "FACULTY":
        navigate("/faculty/dashboard");
        break;
      default:
        navigate("/unauthorized");
    }

  } catch (err) {
    setError(err.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page-center otp-container">
      <div className="card otp-card">
        <div className="otp-header">
          <h2>OTP Verification</h2>
          <p>Enter the 6-digit OTP sent to your registered email</p>
        </div>

        <div className="otp-input-group" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="otp-input"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && <div className="otp-error">{error}</div>}

        <div className="otp-button">
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>

        <div className="otp-resend">
          {canResend ? (
            <button onClick={startTimer}>Resend OTP</button>
          ) : (
            <>Resend OTP in {timeLeft}s</>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
