import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "./apiFetch";

const API = "https://real-estate-market-place-api.vercel.app/api/v1";

export function useSellerVerification(enabled = true) {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(enabled);

  const fetchVerification = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);

      const response = await apiFetch(`${API}/requests/my-request`);

      if (response.status === 404) {
        setVerification({ status: "none" });
        return;
      }

      if (response.status === 401 || response.status === 403) {
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
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      fetchVerification();
    } else {
      setLoading(false);
    }
  }, [fetchVerification, enabled]);

  const isApproved = verification?.status === "approved";

  return { verification, loading, isApproved, refetch: fetchVerification };
}