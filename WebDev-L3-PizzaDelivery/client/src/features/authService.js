import api from "../services/api";

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Admin login
export const loginAdmin = async (credentials) => {
  const response = await api.post("/admin/login", credentials);
  return response.data;
};

// Get logged-in user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Verify email with the six-digit OTP sent during registration
export const verifyEmail = async (email, code) => {
  const response = await api.post("/auth/verify-email", { email, code });
  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.post(
    `/auth/reset-password?token=${token}`,
    {
      password,
    }
  );

  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};