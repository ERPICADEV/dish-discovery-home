
import { api } from "./api";

export interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  cuisine_type: string;
  chef_id: string;
  available: boolean;
  created_at: string;
}

export const getAllDishes = async () => {
  const response = await api<{ dishes: Dish[] }>("/dishes/all", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.dishes;
};

export const searchDishes = async (params: {
  title?: string;
  cuisine_type?: string;
  min_price?: number;
  max_price?: number;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params.title) queryParams.append("title", params.title);
  if (params.cuisine_type) queryParams.append("cuisine_type", params.cuisine_type);
  if (params.min_price) queryParams.append("min_price", params.min_price.toString());
  if (params.max_price) queryParams.append("max_price", params.max_price.toString());
  
  const response = await api<{ dishes: Dish[] }>(
    `/dishes/search?${queryParams.toString()}`,
    { 
      method: "GET",
      requiresAuth: true 
    }
  );
  
  return response.dishes;
};

export const getDishById = async (id: string) => {
  const response = await api<{ dish: Dish }>(`/dishes/${id}`, {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.dish;
};

export const addDish = async (dishData: Omit<Dish, "id" | "chef_id" | "created_at">) => {
  const response = await api<{ dish: Dish, message: string }>("/dishes/add", {
    method: "POST",
    body: JSON.stringify(dishData),
    requiresAuth: true,
  });
  
  return response;
};

export const getChefDishes = async () => {
  const response = await api<{ dishes: Dish[] }>("/dishes/by-chef", {
    method: "GET",
    requiresAuth: true,
  });
  
  return response.dishes;
};

export const updateDish = async (id: string, updates: Partial<Dish>) => {
  const response = await api<{ dish: Dish, message: string }>(`/dishes/edit/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
    requiresAuth: true,
  });
  
  return response;
};

export const deleteDish = async (id: string) => {
  const response = await api<{ message: string }>(`/dishes/delete/${id}`, {
    method: "DELETE",
    requiresAuth: true,
  });
  
  return response;
};
