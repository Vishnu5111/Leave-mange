import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./OtpVerify.css";

const OTP_LENGTH = 6;
const RESEND_TIME = 30;

const OtpVerify = () => {
  const { empId } = useParams();
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

    const pastedOtp = pasted.split("");
    setOtp(pastedOtp);

    pastedOtp.forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    inputRefs.current[OTP_LENGTH - 1]?.focus();
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

      // 🧪 MOCK RESPONSE
      const data = {
        success: true,
        token: "jwt_token_here",
        role: "FACULTY",
        firstLogin: false,
      };

      if (!data.success) throw new Error("Invalid OTP");

      handleLoginSuccess(data.token, {
        role: data.role,
        firstLogin: data.firstLogin,
      });

      navigate("/dashboard");
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
          <p>Enter the 6-digit OTP sent to your registered mobile</p>
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
