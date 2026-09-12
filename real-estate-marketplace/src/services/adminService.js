import { apiFetch } from "../utils/apiFetch";

const BASE = import.meta.env.VITE_API_BASE_URL;

async function handle(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// ---------- Dashboard ----------
export async function getAdminDashboardStats() {
  const res = await apiFetch(`${BASE}/admins/dashboard`);
  return handle(res);
}

// ---------- Listings ----------
export async function getAllListings(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await apiFetch(`${BASE}/admins/listings${query ? `?${query}` : ""}`);
  return handle(res);
}

export async function getListingById(id) {
  const res = await apiFetch(`${BASE}/admins/listings/${id}`);
  return handle(res);
}

export async function deleteListing(id) {
  const res = await apiFetch(`${BASE}/admins/listings/${id}`, { method: "DELETE" });
  return handle(res);
}

export async function approveListing(id) {
  const res = await apiFetch(`${BASE}/admins/listings/${id}/approve`, { method: "PATCH" });
  return handle(res);
}

export async function rejectListing(id, reason) {
  const res = await apiFetch(`${BASE}/admins/listings/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  return handle(res);
}

// ---------- Users ----------
export async function getAllUsers(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await apiFetch(`${BASE}/admins/users${query ? `?${query}` : ""}`);
  return handle(res);
}

export async function getUserById(id) {
  const res = await apiFetch(`${BASE}/admins/users/${id}`);
  return handle(res);
}

export async function deleteUser(id) {
  const res = await apiFetch(`${BASE}/admins/users/${id}`, { method: "DELETE" });
  return handle(res);
}
// ---------- Requests ----------
export async function getAllRequests() {
  const res = await apiFetch(`${BASE}/admins/requests`);
  return handle(res);
}

export async function approveRequest(id) {
  const res = await apiFetch(`${BASE}/admins/requests/${id}/approve`, { method: "PATCH" });
  return handle(res);
}

export async function rejectRequest(id, message) {
  const res = await apiFetch(`${BASE}/admins/requests/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ message }), // هنا غيرناها من rejectionReason إلى message عشان تتوافق مع الباك إند
  });
  return handle(res);
}