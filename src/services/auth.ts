
import { api } from "./api";

export interface User {
  id: string;
  email: string;
  user_metadata: {
    role: "chef" | "customer";
  };
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface AuthResponse {
  user: User;
  session?: Session;
  message?: string;
}

export const signup = async (email: string, password: string, role: "chef" | "customer") => {
  const response = await api<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });

  return response;
};

export const login = async (email: string, password: string) => {
  const response = await api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.session) {
    localStorage.setItem("token", response.session.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  return response;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getProfile = async () => {
  const response = await api<{ user: User }>("/auth/profile", {
    method: "GET",
    requiresAuth: true,
  });

  return response.user;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null;
};
