
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/ErrorPage.css"
function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isNetworkError =
    location.state?.type === "network";

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-icon">
          <i
            className={
              isNetworkError
                ? "fa-solid fa-wifi"
                : "fa-solid fa-triangle-exclamation"
            }
          ></i>
        </div>

        <h1>
          {isNetworkError
            ? "No Internet Connection"
            : "Something Went Wrong"}
        </h1>

        <p>
          {isNetworkError
            ? "Please check your internet connection and try again."
            : "Something went wrong while loading this page."}
        </p>

        <div className="error-actions">
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            <i className="fa-solid fa-rotate-right"></i>
            Try Again
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;

