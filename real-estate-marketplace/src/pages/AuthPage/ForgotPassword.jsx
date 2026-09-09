import { useState } from "react";

function ForgotPassword({ closeModal }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      console.log("Forgot Password Status:", response.status);
      console.log("Forgot Password Response:", data);

      if (!response.ok) {
        setError(data.message || "Please enter a valid email.");
        return;
      }

      setSuccess(
        data.message ||
          "If an account with that email exists, a reset link has been sent."
      );
    } catch (error) {
      console.error("Forgot Password Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
          setSuccess("");
        }}
      />

      {error && <p className="error-message">{error}</p>}

      {success && <p className="success-message">{success}</p>}

      {/* Send Reset Link */}
      <button
        type="button"
        className="auth-button"
        disabled={loading}
        onClick={handleForgotPassword}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      {/* Back to Login */}
      <button
        type="button"
        className="back-login"
        onClick={closeModal}
      >
        Back to Login
      </button>
    </div>
  );
}

export default ForgotPassword;