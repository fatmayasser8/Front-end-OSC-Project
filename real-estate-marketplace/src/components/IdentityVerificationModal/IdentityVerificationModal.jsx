import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFetch } from "../../utils/apiFetch";
import "../../styles/IdentityVerificationModal.css";

const API = "https://real-estate-market-place-api.vercel.app/api/v1";

function IdentityVerificationModal({ verification, onClose, refetch }) {
  const navigate = useNavigate();
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setIdFile(selected);
    setIdPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async () => {
    if (!idFile) {
      setError("Please select your ID image first.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const data = new FormData();
      data.append("identityDocument", idFile);

      const response = await apiFetch(`${API}/requests`, {
        method: "POST",
        body: data,
      });

      if (response.status === 401) {
        navigate("/auth/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError("You already have a pending or approved verification request.");
        } else {
          setError(result.message || "Something went wrong while submitting your request.");
        }
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Verification request submitted",
        text: "We'll review your ID and notify you once it's approved.",
      });

      setIdFile(null);
      setIdPreview(null);
      await refetch();
    } catch (error) {
      console.error("Submit identity error:", error);
      setError("Something went wrong while submitting your request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!verification?._id) return;

    try {
      setCanceling(true);
      setCancelError("");

      const response = await apiFetch(`${API}/requests/${verification._id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        navigate("/auth/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setCancelError("This request no longer exists.");
        } else if (response.status === 403) {
          setCancelError("You're not allowed to cancel this request.");
        } else {
          setCancelError(result.message || "Failed to cancel request.");
        }
        return;
      }

      await refetch();
    } catch (error) {
      console.error("Cancel identity error:", error);
      setCancelError("Something went wrong while canceling your request.");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="verification-modal-overlay" onClick={onClose}>
      <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
        <button className="verification-modal-close" onClick={onClose} type="button">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {verification?.status === "pending" ? (
          <>
            <i className="fa-solid fa-clock modal-icon pending"></i>
            <h3>Verification request pending</h3>
            <p>You'll be able to list a property once your ID is approved.</p>

            {cancelError && <p className="verification-error">{cancelError}</p>}

            <div className="modal-actions-row">
              <button type="button" className="refresh-status-btn" onClick={refetch}>
                <i className="fa-solid fa-rotate"></i>
                Check Status
              </button>

              <button
                type="button"
                className="cancel-id-btn"
                onClick={handleCancel}
                disabled={canceling}
              >
                {canceling ? "Canceling..." : "Cancel Request"}
              </button>
            </div>
          </>
        ) : (
          <>
            <i className="fa-solid fa-id-card modal-icon"></i>
            <h3>
              {verification?.status === "rejected"
                ? "Your previous request was rejected — please upload a new ID"
                : "Verify your identity to start selling"}
            </h3>
            <p className="modal-hint">
              This is a one-time step. Once approved, you'll be able to list
              as many properties as you want without uploading your ID again.
            </p>

            {verification?.status === "rejected" && verification?.rejectionReason && (
              <p className="rejection-reason">Reason: {verification.rejectionReason}</p>
            )}

            {idPreview && (
              <div className="id-preview">
                <img src={idPreview} alt="ID preview" />
              </div>
            )}

            <label className="upload-id-btn">
              <i className="fa-solid fa-upload"></i>
              {idFile ? "Change Image" : "Choose ID Image"}
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>

            {error && <p className="verification-error">{error}</p>}

            <button
              type="button"
              className="submit-id-btn"
              onClick={handleSubmit}
              disabled={submitting || !idFile}
            >
              {submitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default IdentityVerificationModal;