import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "./apiFetch";

const API = "https://real-estate-market-place-api.vercel.app/api/v1";

export function useSellerVerification() {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVerification = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiFetch(`${API}/requests/my-request`);

      if (response.status === 404) {
        setVerification({ status: "none" });
        return;
      }

      if (response.status === 401) {
        setVerification({ status: "unauthorized" });
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to check verification status.");
      }

      setVerification(result.data);
      console.log("Verification data:", result.data);
    } catch (error) {
      console.error("Verification check error:", error);
      setVerification({ status: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  const isApproved = verification?.status === "approved";

  return { verification, loading, isApproved, refetch: fetchVerification };
}