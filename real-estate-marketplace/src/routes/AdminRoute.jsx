import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminRoute() {
  const location = useLocation();

  // Get access token
  const token = localStorage.getItem("accessToken");

  // Not logged in
  if (!token) {
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

  // Get logged-in user
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    console.error("Invalid user data:", error);
    user = {};
  }

  // Check admin role
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;