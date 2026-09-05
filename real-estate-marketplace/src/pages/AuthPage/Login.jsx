import { useState } from "react";
function Login() {

const [email,setEmail]=useState("")
const [password, setPassword] = useState("");

const handleLogin=(e)=>{
        e.preventDefault();

    console.log(email);
    console.log(password);
//API.....
}
  return (
<form onSubmit={handleLogin} className="auth-form">

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <p className="forgot-password">
    Forgot Password?
  </p>

  <button type="submit" className="auth-button">
    Login
  </button>

  <div className="divider">
    <span>OR</span>
  </div>

  <button type="button" className="social-button">
    <i className="fa-brands fa-google"></i>
    Continue with Google
  </button>


  <button type="button" className="social-button">
    <i className="fa-brands fa-facebook"></i>
    Continue with Facebook
  </button>

</form>
  );

}

export default Login;