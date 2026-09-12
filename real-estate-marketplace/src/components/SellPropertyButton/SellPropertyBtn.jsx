import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSellerVerification } from "../../utils/useSellerVerification";
import IdentityVerificationModal from "../IdentityVerificationModal/IdentityVerificationModal";

function SellPropertyButton() {
  const navigate = useNavigate();
  const { verification, isApproved, loading, refetch } = useSellerVerification();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (loading) return;

    if (isApproved) {
      navigate("/sell-property");
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (isApproved && showModal) {
      setShowModal(false);
      navigate("/sell-property");
    }
  }, [isApproved, showModal, navigate]);

  return (
    <>
      <button
        type="button"
        className="sell-property-entry-btn"
        onClick={handleClick}
        disabled={loading}
      >
        <i className="fa-solid fa-house"></i>
        {loading ? "Checking..." : "Sell a Property"}
      </button>

      {showModal && (
        <IdentityVerificationModal
          verification={verification}
          onClose={() => setShowModal(false)}
          refetch={refetch}
        />
      )}
    </>
  );
}

export default SellPropertyButton;