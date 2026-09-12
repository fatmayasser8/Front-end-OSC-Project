

import axiosClient from "../api/axiosClient";
export async function getSellerDashboardStats() {
  const { data } = await axiosClient.get("/sellers/dashboard"); // TODO confirm path
  return data;
}

export async function getSellerProperties() {
  const { data } = await axiosClient.get("/sellers/listings"); // TODO confirm path
  return data;
}

export async function getSellerInquiries() {
  const { data } = await axiosClient.get("/sellers/inquiries"); // TODO confirm path
  return data;
}