
import { useNavigate } from "react-router-dom";
import "../../styles/NotFound.css"

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-number">
          404
        </div>

        <h1>Page Not Found</h1>

        <p>
          The page you're looking for doesn't exist
          or may have been moved.
        </p>

        <button
          type="button"
          onClick={() => navigate("/home")}
        >
          <i className="fa-solid fa-house"></i>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;

