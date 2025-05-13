
import { api } from "./api";

export interface User {
  id: string;
  email: string;
  user_metadata: {
    role: "chef" | "customer";
    name?: string;
    phone?: string;
    location?: string;
    about?: string;
    experience?: string;
    profile_image?: string;
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

interface ChefMetadata {
  name: string;
  phone: string;
  location: string;
  about: string;
  experience: string;
  profile_image: string;
}

export const signup = async (
  email: string, 
  password: string, 
  role: "chef" | "customer",
  chefMetadata?: ChefMetadata
) => {
  const response = await api<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ 
      email, 
      password, 
      role,
      ...(chefMetadata && role === "chef" ? chefMetadata : {})
    }),
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

  // Update the stored user data with the latest from the server
  if (response.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  return response.user;
};

export const getChefProfile = async (chefId: string) => {
  const response = await api<{ user: User }>(`/users/${chefId}`, {
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
