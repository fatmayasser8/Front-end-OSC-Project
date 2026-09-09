import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import ForgotPassword from "./ForgotPassword";
import { GoogleLogin } from "@react-oauth/google";
function Login() {
  const navigate = useNavigate();

const [email,setEmail]=useState("")
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      }
    );

    const data = await response.json();

    console.log("Google Login Response:", data);

    if (!response.ok) {
      setError(data.message || "Google authentication failed.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    navigate("/home");
  } catch (error) {
    console.error("Google Login Error:", error);
    setError("Something went wrong with Google login.");
  } finally {
    setLoading(false);
  }
};


const  handleLogin=async(e)=>{
        e.preventDefault();

    console.log(email);
    console.log(password);
//API.....

// Clear previous error
 setError("");

// Basic validation
if (!email || !password) { 

  setError("Please enter your email and password.");
   return; 

  }



try { 
  setLoading(true);
   const response = await fetch( "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/login",
     { method: "POST", 

      headers: { "Content-Type": "application/json", },

       body: JSON.stringify({ email, password, }), } );
       
       const data = await response.json();

     // If login failed
if (!response.ok) { 
  setError( data.message || "Invalid email, password, or credentials." );
   return; }

console.log("Login successful:", data);
// Save JWT token
localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("refreshToken", data.refreshToken);
// Go to Home
navigate("/home");
}catch (error)
 { console.error("Login error:", error);
   setError("Something went wrong. Please try again.");
   } 
   finally { setLoading(false); }
  }

     

  return (
<form onSubmit={handleLogin} className="auth-form">

  <input
    type="email"
    placeholder="Email"
    value={email}
onChange={(e) => {
  setEmail(e.target.value);
  setError("");
}}
  />

<div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
onChange={(e) => {
  setPassword(e.target.value);
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

  {error && ( <p className="error-message"> {error} </p> )}

<p
  className="forgot-password"
  onClick={() => setShowForgotPassword(true)}
>
  Forgot Password?
</p>

<button type="submit" className="auth-button" disabled={loading} >
   {loading ? "Logging in..." : "Login"}
    </button>

  <div className="divider">
    <span>OR</span>
  </div>

<div className="google-button-wrapper">
  <div className="google-login-overlay">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        setError("Google login failed. Please try again.");
      }}
    />
  </div>

  <div className="google-custom-button">
    <i className="fa-brands fa-google"></i>
    Continue with Google
  </div>
</div>


  {/* <button type="button" className="social-button">
    <i className="fa-brands fa-facebook"></i>
    Continue with Facebook
  </button> */}


{showForgotPassword && (
  <div className="forgot-modal-overlay">
    <div className="forgot-modal">

      <button
        type="button"
        className="forgot-close"
        onClick={() => setShowForgotPassword(false)}
      >
        ×
      </button>

      <h2>Forgot Password?</h2>

      <p className="forgot-description">
        Enter your email and we'll send you a password reset link.
      </p>

      <ForgotPassword
        closeModal={() => setShowForgotPassword(false)}
      />

    </div>
  </div>
)}


</form>
  );

}

export default Login;