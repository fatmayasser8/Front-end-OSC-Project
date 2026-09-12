
import axiosClient from "../api/axiosClient";
import { setToken, clearToken } from "../utils/tokenStorage";

export async function login(email, password) {
  const { data } = await axiosClient.post("/auth/login", { email, password });
  if (data?.token) {
    setToken(data.token);
  }

  return data;
}

export async function register(payload) {
  const { data } = await axiosClient.post("/auth/register", payload);
  return data;
}

export function logout() {
  clearToken();
  window.location.href = "/auth/login";
}