import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  loginAdmin,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../features/authService";

export const AuthContext = createContext(null);

// Get saved user from localStorage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to read stored user:", error);

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

  // Check if the saved token is still valid
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
        console.error(
          "Authentication check failed:",
          error
        );

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

  // Normal user login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    const newToken = data.token;
    const loggedInUser = data.user;

    if (!newToken || !loggedInUser) {
      throw new Error(
        "Login response was incomplete"
      );
    }

    localStorage.setItem("token", newToken);
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setToken(newToken);
    setUser(loggedInUser);

    return data;
  };

  // Admin login
  const adminLogin = async (credentials) => {
    const data = await loginAdmin(credentials);

    const loggedInUser = data.admin;

    if (!data.token || !loggedInUser) {
      throw new Error(
        "Admin login response was incomplete"
      );
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setToken(data.token);
    setUser(loggedInUser);

    return data;
  };

  // Registration
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
  };

  // Called after email verification
  const completeVerification = (data) => {
    if (!data?.token || !data?.user) {
      throw new Error(
        "Verification response was incomplete"
      );
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);
  };

  // Logout
  const logout = () => {
    try {
      logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
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

// Custom hook for accessing authentication
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};