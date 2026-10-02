import api from "./api.js";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const forgotPassword = async ({ email }) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await api.post(`auth/reset-password/${token}`, { password });
  return response.data;
};

export const resendVerification = async () => {
  const response = await api.post("/auth/resend-verification");
  return response.data;
};
