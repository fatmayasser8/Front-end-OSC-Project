
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location.pathname,
          message: "Please login to access this page.",
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;

