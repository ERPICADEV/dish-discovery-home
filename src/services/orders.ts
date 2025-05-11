
import { api } from "./api";

export interface Order {
  id: string;
  customer_id: string;
  chef_id: string;
  dish_id: string;
  quantity: number;
  total_price: number;
  delivery_address: string;
  special_instructions?: string;
  status: "pending" | "accepted" | "preparing" | "ready" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
  dishes?: {
    title: string;
    image_url: string;
    cuisine_type: string;
  };
}

export interface CreateOrderData {
  dish_id: string;
  quantity: number;
  delivery_address: string;
  special_instructions?: string;
}

// Customer creates a new order
export const createOrder = async (orderData: CreateOrderData) => {
  const response = await api<{ message: string; order: Order }>("/orders/create", {
    method: "POST",
    body: JSON.stringify(orderData),
    requiresAuth: true,
  });
  
  return response;
};

// Customer gets their orders
export const getUserOrders = async (status?: string) => {
  let endpoint = "/orders/by-user";
  if (status) {
    endpoint += `?status=${status}`;
  }
  
  const response = await api<{ orders: Order[] }>(endpoint, {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.orders;
};

// Chef gets orders for their dishes
export const getChefOrders = async () => {
  const response = await api<{ orders: Order[] }>("/orders/by-chef", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.orders;
};

// Chef updates order status
export const updateOrderStatus = async (id: string, status: Order["status"]) => {
  const response = await api<{ message: string; order: Order }>(`/orders/status/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    requiresAuth: true,
  });
  
  return response;
};
