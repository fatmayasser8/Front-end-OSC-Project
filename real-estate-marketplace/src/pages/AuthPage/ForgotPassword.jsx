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
    <div className="flex flex-col gap-[15px]">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
          setSuccess("");
        }}
        className="h-12 w-full rounded-lg border border-[#444] bg-[#1d1d1d] px-[15px] text-sm text-white outline-none transition focus:border-[#e8c877] placeholder:text-[#777]"
      />

      {error && (
        <p className="my-2 text-left text-sm font-medium text-[#d93025]">
          {error}
        </p>
      )}

      {success && (
        <p className="m-0 rounded-lg border border-[#b7ebc6] bg-[#f0fff4] px-3 py-2.5 text-sm text-[#218838]">
          {success}
        </p>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={handleForgotPassword}
        className="mt-[5px] flex cursor-pointer items-center justify-center rounded-[10px] border-0 bg-gradient-to-br from-[#d4af37] to-[#f0d477] p-3.5 text-base font-bold text-[#0b0b0b] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="mr-2 inline-block h-[18px] w-[18px] animate-spin rounded-full border-[3px] border-white/40 border-t-white"></span>
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <button
        type="button"
        onClick={closeModal}
        className="cursor-pointer border-0 bg-transparent text-sm text-[#aaa] transition hover:text-[#e8c877]"
      >
        Back to Login
      </button>
    </div>
  );
}

export default ForgotPassword;