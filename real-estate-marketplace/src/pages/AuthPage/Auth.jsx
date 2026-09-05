import { NavLink, Outlet } from "react-router-dom";
import "./Auth.css";

function Auth() {
  return (
    <div className="auth-container">
      <div className="auth-box">

 <h1 className="auth-title">
  <i className="fa-solid fa-house-chimney"></i>
NOVA
</h1>
        <p className="auth-subtitle">
          Welcome to your next chapter
        </p>

<div className="auth-tabs">
  <NavLink to="/auth/login">Login</NavLink>

  <NavLink to="/auth/register">Register</NavLink>
</div>

        <Outlet />

      </div>
    </div>
  );
}

export default Auth;