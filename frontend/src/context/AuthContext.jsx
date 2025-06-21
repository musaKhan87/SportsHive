import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser, loginUser, registerUser, updateUserProfile } from "../api/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await getCurrentUser(token);
      setUser(res.data);
     
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerUser(name, email, password);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateProfile =async (formData) => {
    try {
      const res = await updateUserProfile(formData);
      if (res.status === 200) {
        const token = localStorage.getItem("token");
        const updatedUserRes = await getCurrentUser(token);
        setUser(updatedUserRes.data); // ✅ refresh context
        return { success: true };
      } else {
        return { success: false, error: "Failed to update" };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  const isAdmin = user?.role === "admin";

  const value = { user, loading, isAdmin, register, login, logout ,updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
