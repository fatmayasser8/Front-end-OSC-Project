import { NavLink, Outlet } from "react-router-dom";
import "../../styles/Auth.css";

function Auth() {
  return (
<div className="auth-container flex h-dvh w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-2 sm:min-h-screen sm:px-6 sm:py-8">
      <div className="w-full max-w-[450px] rounded-[22px] border border-[#d4af37]/35 bg-[#111111] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(212,175,55,0.08)] sm:p-9 md:p-[45px]">

        <h1 className="mb-2 text-center text-3xl font-bold tracking-[2px]  sm:text-4xl text-warning">
          <i className="fa-solid fa-house-chimney mr-2"></i>
          NOVA
        </h1>

        <p className="mb-7 text-center text-sm text-[#a5a5a5] sm:mb-[30px]">
          Welcome to your next chapter
        </p>

        <div className="mb-7 flex gap-2.5 sm:mb-[30px] auth-tabs">
          <NavLink
            to="/auth/login"
          >
            Login
          </NavLink>

          <NavLink
            to="/auth/register"
          >
            Register
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Auth;