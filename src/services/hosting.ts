
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

export interface BookingData {
  seats: number;
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

// Book a hosting
export const bookHosting = async (hostingId: string, bookingData: BookingData) => {
  const response = await api<{ message: string; booking: any }>(`/hosting/book/${hostingId}`, {
    method: "POST",
    body: JSON.stringify(bookingData),
    requiresAuth: true,
  });
  
  return response;
};

// Get bookings for a customer
export const getCustomerBookings = async () => {
  const response = await api<{ bookings: any[] }>("/hosting/bookings/customer", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.bookings;
};

// Get bookings for a chef
export const getChefBookings = async () => {
  const response = await api<{ bookings: any[] }>("/hosting/bookings/chef", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.bookings;
};
