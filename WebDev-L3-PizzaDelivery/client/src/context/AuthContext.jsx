import { createContext, useEffect, useState } from "react";

import {
  loginUser,
  loginAdmin,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../features/authService";

export const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // Check authentication when application starts
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error("Authentication check failed:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    const newToken = data.token;
    const loggedInUser = data.user;

    if (!newToken || !loggedInUser) {
      throw new Error("Login response was incomplete");
    }

    localStorage.setItem("token", newToken);
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
    setToken(newToken);

    return data;
  };

  const adminLogin = async (credentials) => {
    const data = await loginAdmin(credentials);
    const loggedInUser = data.admin;

    if (!data.token || !loggedInUser) {
      throw new Error("Admin login response was incomplete");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setToken(data.token);

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
  };

  const completeVerification = (data) => {
    if (!data?.token || !data?.user) {
      throw new Error("Verification response was incomplete");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  // Logout
  const logout = () => {
    logoutUser();

    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,

    isAuthenticated: !!token,

    login,
    adminLogin,
    register,
    completeVerification,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};