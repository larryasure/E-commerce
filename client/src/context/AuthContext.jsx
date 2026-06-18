import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("me/");
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Auth check failed, maybe token expired");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const userResponse = await axiosInstance.get("me/");
      setUser(userResponse.data);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosInstance.post("logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error({ "Logout error": error });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (formData) => {
    try {
      const response = await axiosInstance.post("users/", formData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        isAuthenticated,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
