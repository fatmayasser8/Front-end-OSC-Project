import { refreshAccessToken } from "./refreshToken";

export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  

  const makeRequest = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

   
    if (!newAccessToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return response;
    }


    response = await makeRequest(newAccessToken);
  }

  return response;
};