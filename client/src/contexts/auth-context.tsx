import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { email?: string; name?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, navigate] = useLocation();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await fetch("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("authToken");
          }
        } catch (error) {
          localStorage.removeItem("authToken");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      navigate("/");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
  };


  const updateProfile = async (updateData: { email?: string; name?: string; currentPassword?: string; newPassword?: string }) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Profile update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};