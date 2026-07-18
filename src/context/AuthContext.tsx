import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";
import type { User, UserRole } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  googleLogin: (credential: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const { data } = await api.get("/users/profile");
    setUser(data.data);
  };

  // Restore the session from a stored token on every app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchProfile()
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    await fetchProfile();
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    localStorage.setItem("token", data.token);
    await fetchProfile();
  };

  const googleLogin = async (credential: string, role?: UserRole) => {
    const { data } = await api.post("/auth/google", { credential, role });
    localStorage.setItem("token", data.token);
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};