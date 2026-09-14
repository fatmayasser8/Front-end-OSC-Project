import { Navigate, Outlet, useLocation } from "react-router-dom";

function SellerRoute() {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

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

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    console.error("Invalid user data:", error);
    user = {};
  }

  if (user.role === "admin") {
    return <Navigate to="/adminDashBoard" replace />;
  }

  return <Outlet />;
}

export default SellerRoute;