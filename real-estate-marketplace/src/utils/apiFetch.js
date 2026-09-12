import { refreshAccessToken } from "./refreshToken";

export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  const makeRequest = async (token) => {
    const isFormData = options.body instanceof FormData;

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
  };

  let response = await makeRequest(accessToken);
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; 
      return response;
    }

    localStorage.setItem("accessToken", newAccessToken);
  }

  return response;
};