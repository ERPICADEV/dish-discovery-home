
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

export interface ChefProfile {
  id: string;
  name: string;
  location: string;
  about: string;
  experience: string;
  image_url: string;
  phone: string;
  cuisine_specialty?: string;
  rating?: number;
  review_count?: number;
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

interface ChefProfileResponse {
  user: User;
  chef_profile?: ChefProfile;
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
  localStorage.removeItem("chef_profile");
};

export const getProfile = async () => {
  const response = await api<ChefProfileResponse>("/auth/profile", {
    method: "GET",
    requiresAuth: true,
  });

  // If there's a chef_profile, store it in localStorage
  if (response.chef_profile) {
    localStorage.setItem("chef_profile", JSON.stringify(response.chef_profile));
  }

  return {
    user: response.user,
    chefProfile: response.chef_profile
  };
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

export const getStoredChefProfile = (): ChefProfile | null => {
  const profileStr = localStorage.getItem("chef_profile");
  if (!profileStr) return null;

  try {
    return JSON.parse(profileStr) as ChefProfile;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null;
};
