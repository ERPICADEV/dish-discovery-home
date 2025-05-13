import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "https://build-idish-backend-production.up.railway.app";

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  requiresAuth?: boolean;
}

export const api = async <T>(
  endpoint: string,
  options: ApiOptions = { method: "GET" }
): Promise<T> => {
  try {
    const { method = "GET", body, requiresAuth = false } = options;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (requiresAuth) {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    throw error;
  }
};
