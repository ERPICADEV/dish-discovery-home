import { api } from "./api";

export interface Booking {
  id: string;
  customer_id: string;
  chef_id: string;
  hosting_id: string;
  number_of_guests: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  date: string;
  time_slot: string;
  created_at: string;
  updated_at: string;
  special_requests?: string;
  hosting?: {
    title: string;
    location: string;
    image_url?: string;
  };
}

export interface CreateBookingData {
  hosting_id: string;
  seats: number;
  booking_date: string;
  time_slot: string;
  special_requests?: string;
}

// Customer creates a new booking
export const createBooking = async (bookingData: CreateBookingData) => {
  const response = await api<{ message: string; booking: Booking }>("/bookings/create", {
    method: "POST",
    body: JSON.stringify(bookingData),
    requiresAuth: true,
  });
  
  return response;
};

// Customer gets their bookings
export const getUserBookings = async (status?: string) => {
  let endpoint = "/bookings/by-user";
  if (status) {
    endpoint += `?status=${status}`;
  }
  
  const response = await api<{ bookings: Booking[] }>(endpoint, {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.bookings;
};

// Chef gets bookings for their hostings
export const getChefBookings = async () => {
  const response = await api<{ bookings: Booking[] }>("/bookings/by-chef", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.bookings;
};

// Chef updates booking status
export const updateBookingStatus = async (id: string, status: Booking["status"]) => {
  const response = await api<{ message: string; booking: Booking }>(`/bookings/status/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    requiresAuth: true,
  });
  
  return response;
}; 