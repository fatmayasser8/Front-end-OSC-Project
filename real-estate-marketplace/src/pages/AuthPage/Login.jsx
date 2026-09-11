import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Google authentication failed.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(result.data.user));
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);
    localStorage.setItem("userRole", result.data.user.role);

    navigate("/home");
  } catch (error) {
    console.error("Google Login Error:", error);
    setError("Something went wrong with Google login.");
  } finally {
    setLoading(false);
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.message || "Invalid email, password, or credentials.");
      return;
    }

    
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(result.data.user));
    localStorage.setItem("userRole", result.data.user.role); 

    navigate("/home");
  } catch (error) {
    console.error("Login error:", error);
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-[15px]"
      >
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="login-input w-full rounded-[10px] border border-[#333] bg-[#181818] px-4 py-3.5 text-[15px] text-white outline-none transition duration-300 placeholder:text-[#777] focus:border-[#d4af37] focus:shadow-[0_0_0_2px_rgba(212,175,55,0.1)]"
        />

        {/* Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="login-input w-full rounded-[10px] border border-[#333] bg-[#181818] px-4 py-3.5 pr-[45px] text-[15px] text-white outline-none transition duration-300 placeholder:text-[#777] focus:border-[#d4af37] focus:shadow-[0_0_0_2px_rgba(212,175,55,0.1)]"
          />

          <i
            className={`fa-solid ${
              showPassword ? "fa-eye" : "fa-eye-slash"
            } absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer text-base text-[#777] transition hover:text-[#c9952e]`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {/* Error */}
        {error && (
          <p className="my-2 text-left text-sm font-medium text-[#d93025]">
            {error}
          </p>
        )}

        {/* Forgot Password */}
        <p
          className="cursor-pointer text-right text-sm text-[#d4af37] transition hover:text-[#e8c877]"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </p>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-4 mt-[5px] flex cursor-pointer items-center justify-center  border-0 bg-gradient-to-br from-[#d4af37] to-[#f0d477] p-3.5 text-base font-bold text-[#0b0b0b] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="my-2.5 flex items-center gap-3 text-[13px] text-[#777]">
          <span className="h-px flex-1 bg-[#333]"></span>
          <span>OR</span>
          <span className="h-px flex-1 bg-[#333]"></span>
        </div>

        {/* Google */}
        <div className="relative h-[47px] w-full">
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 ">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Google login failed. Please try again.");
              }}
            />
          </div>

          <div className="google-login-button">
            <i className="fa-brands fa-google mr-[5px] text-base"></i>
            Continue with Google
          </div>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-5 py-5">
          <div className="relative w-full max-w-[430px] animate-[forgotModal_0.25s_ease] rounded-[18px] border border-[#e8c877]/35 bg-[#151515] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:p-[35px]">

            <button
              type="button"
              className="absolute right-4 top-3 cursor-pointer border-0 bg-transparent text-[28px] text-[#aaa] transition hover:text-[#e8c877]"
              onClick={() => setShowForgotPassword(false)}
            >
              ×
            </button>

            <h2 className="mb-2.5 text-center text-2xl font-bold text-[#e8c877]">
              Forgot Password?
            </h2>

            <p className="mb-[25px] text-center text-sm leading-[1.6] text-[#aaa]">
              Enter your email and we'll send you a password reset link.
            </p>

            <ForgotPassword
              closeModal={() => setShowForgotPassword(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Login;