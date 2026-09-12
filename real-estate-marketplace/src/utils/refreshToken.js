// refreshToken.js
let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(
        "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
      }

      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      return data.data.accessToken;
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};