import { createContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../features/authService";


// Allow to share data accross many components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);


  // Check user when application starts
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        const currentUser = data.user || data;

        setUser(currentUser);
      } catch (error) {
        console.error("Authentication failed:", error);

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

    if (!newToken) {
      throw new Error("Token was not returned by server");
    }

    localStorage.setItem("token", newToken);

    const loggedInUser = data.user || data.data?.user;

    if (loggedInUser) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    }

    setToken(newToken);

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
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
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};