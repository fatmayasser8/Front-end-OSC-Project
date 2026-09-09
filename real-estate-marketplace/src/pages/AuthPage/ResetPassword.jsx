import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password Validation
  const isPasswordValid =
    newPassword.length >= 8 &&
    newPassword.length <= 12 &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[!@#$%^&*(),.?":{}|<>_\-]/.test(newPassword) &&
    !/\s/.test(newPassword);

  // Confirm Password Validation
  const isConfirmPasswordValid =
    confirmPassword.length > 0 &&
    confirmPassword === newPassword;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!newPassword) {
      setError("Password is required.");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "Please enter a valid password according to the requirements."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (!isConfirmPasswordValid) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      console.log("Reset Password Status:", response.status);
      console.log("Reset Password Response:", data);

      if (!response.ok) {
        setError(
          data.message || "Reset token is invalid or has expired."
        );
        return;
      }

      setSuccess("Password updated successfully!");

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error) {
      console.error("Reset Password Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-page">
      <form
        onSubmit={handleResetPassword}
        className="verification-form"
      >
        <h2>Reset Password</h2>

        <p>Enter your new password below.</p>

        {/* New Password */}
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            className={
              newPassword.length === 0
                ? ""
                : isPasswordValid
                ? "input-valid"
                : "input-invalid"
            }
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
          />

          <i
            className={`fa-solid ${
              showPassword ? "fa-eye" : "fa-eye-slash"
            } eye-icon`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {/* Password Warning */}
        {newPassword.length > 0 && !isPasswordValid && (
          <p className="password-warning">
            Password must be 8–12 characters, contain at least one
            uppercase letter, one number, one special character, and
            no spaces.
          </p>
        )}

        {/* Confirm Password */}
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            className={
              confirmPassword.length === 0
                ? ""
                : isConfirmPasswordValid
                ? "input-valid"
                : "input-invalid"
            }
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
          />

          <i
            className={`fa-solid ${
              showConfirmPassword ? "fa-eye" : "fa-eye-slash"
            } eye-icon`}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          ></i>
        </div>

        {/* Confirm Password Warning */}
        {confirmPassword.length > 0 &&
          !isConfirmPasswordValid && (
            <p className="input-warning">
              Passwords do not match.
            </p>
          )}

        {/* Error */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="success-message">
            {success}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;