import { api } from "./api";

export interface Hosting {
  id: string;
  chef_id: string;
  title: string;
  description?: string;
  location: string;
  available_days: string[];
  time_slots: string[];
  max_guests: number;
  price_per_guest: number;
  image_url?: string;
  created_at: string;
}

export interface CreateHostingData {
  title: string;
  description?: string;
  location: string;
  available_days: string[];
  time_slots: string[];
  max_guests: number;
  price_per_guest: number;
  image_url?: string;
}

// Chef creates a new hosting
export const createHosting = async (hostingData: CreateHostingData) => {
  const response = await api<{ message: string; hosting: Hosting }>("/hosting/create", {
    method: "POST",
    body: JSON.stringify(hostingData),
    requiresAuth: true,
  });
  
  return response;
};

// Update an existing hosting
export const updateHosting = async (hostingId: string, hostingData: CreateHostingData) => {
  const response = await api<{ message: string; hosting: Hosting }>(`/hosting/${hostingId}`, {
    method: "PUT",
    body: JSON.stringify(hostingData),
    requiresAuth: true,
  });
  
  return response;
};

// Chef gets their hostings
export const getChefHostings = async () => {
  const response = await api<{ hostings: Hosting[] }>("/hosting/by-chef", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.hostings;
};

// Get all available hostings (for customers)
export const getAllHostings = async () => {
  const response = await api<{ hostings: Hosting[] }>("/hosting/all", {
    method: "GET",
  });
  
  return response.hostings;
};

// Get hosting details by ID
export const getHostingById = async (id: string) => {
  const response = await api<{ hosting: Hosting }>(`/hosting/details/${id}`, {
    method: "GET",
  });
  
  return response.hosting;
};

// Delete a hosting
export const deleteHosting = async (id: string) => {
  const response = await api<{ message: string }>(`/hosting/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
  
  return response;
};
