import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Validtion.css";

function Validation() {
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const [timeLeft, setTimeLeft] = useState(600);
const [isResending, setIsResending] = useState(false);
const [isVerifying, setIsVerifying] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  useEffect(() => {
  if (timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft]);
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;

  console.log("EMAIL RECEIVED:", email);
  console.log("LOCATION STATE:", location.state);

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Email not found");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    if (!code) {
      setErrorMessage("Please enter the verification code");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    if (code.length !== 6) {
      setErrorMessage("Verification code must be 6 digits");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }
setIsVerifying(true);
    try {
      const response = await fetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: code,
          }),
        }
      );

      const data = await response.json();

      console.log("Verify Status:", response.status);
      console.log("Verify Response:", data);

      if (response.status === 200) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccessMessage("Registration successful!");

        setTimeout(() => {
          navigate("/home");
        }, 1500);
        
      } else if (response.status === 400) {
          setIsVerifying(false);
        setErrorMessage(
          data.message || "Invalid or expired verification code"
        );

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
          setIsVerifying(false);
        setErrorMessage("Something went wrong. Please try again.");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
        setIsVerifying(false);
      console.error("Verify OTP error:", error);

      setErrorMessage("Unable to connect to the server");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setErrorMessage("");
    setSuccessMessage("");
      setIsResending(true);

    if (!email) {
      setErrorMessage("Email not found");
  setIsResending(false);

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    try {
      const response = await fetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      console.log("Resend Status:", response.status);
      console.log("Resend Response:", data);

      if (response.status === 200) {

  setTimeLeft(600);

  setSuccessMessage("Verification code resent successfully!");

  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);

      } 
      else if (response.status === 400) {
        setErrorMessage(
          data.message ||
            "Account is already verified or validation failed"
        );

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } 
      else {
        setErrorMessage("Something went wrong. Please try again.");

        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      setErrorMessage("Unable to connect to the server");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }finally {
  setIsResending(false);
}
  };

  return (
    <div className="verification-page">
      <form
        onSubmit={handleVerify}
        className="verification-form"
      >
        <h2>Verify Your Email</h2>

        <p>We sent a verification code to</p>

<strong>{email}</strong>

<p className="timer">
  Code expires in{" "}
  <span>
    {String(minutes).padStart(2, "0")}:
    {String(seconds).padStart(2, "0")}
  </span>
</p>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setCode(value);
          }}
          maxLength={6}
        />

<button
  type="submit"
  className="auth-button"
  disabled={isVerifying}
>
  {isVerifying ? (
    <>
      <span className="spinner"></span>
      Verifying...
    </>
  ) : (
    "Verify Email"
  )}
</button>

<button
  type="button"
  className="resend-button"
  onClick={handleResend}
  disabled={isResending}
>
  {isResending ? (
    <>
      <span className="spinner"></span>
      Resending...
    </>
  ) : (
    "Resend Code"
  )}
</button>

        {successMessage && (
          <div className="success-toast">
            <i className="fa-solid fa-circle-check"></i>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="error-toast">
            <i className="fa-solid fa-circle-exclamation"></i>
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default Validation;