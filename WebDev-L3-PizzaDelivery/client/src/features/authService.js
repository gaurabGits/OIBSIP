import api from "../services/api";


export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};


export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// Get logged-in user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};


export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};