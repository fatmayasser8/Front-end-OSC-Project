
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("preferredLocation");
  localStorage.removeItem("locationSetupDone");
};

export const isFirstLogin = () => {
  return localStorage.getItem("locationSetupDone") !== "true";
};

export const markLocationSetupDone = () => {
  localStorage.setItem("locationSetupDone", "true");
};

export const getPreferredLocation = () => {
  return localStorage.getItem("preferredLocation");
};

export const setPreferredLocation = (location) => {
  localStorage.setItem("preferredLocation", location);
};

