
import { api } from "./api";
import { ChefProfile } from "@/types/chef";
import { User } from "./auth";

// Fetch chef data from API
export const fetchChefData = async (chefId: string): Promise<ChefProfile> => {
  try {
    // Get chef's user profile from the API
    const response = await api<{ user: User }>(`/users/${chefId}`, {
      method: "GET",
      requiresAuth: true,
    });
    
    const chefData = response.user;
    
    // For now, we'll use sample meals and reviews since we don't have APIs for those
    // In a real implementation, you'd fetch these from appropriate endpoints
    const sampleMeals = [
      {
        id: "101",
        name: "Homemade Lasagna",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
        chefName: chefData.user_metadata?.name || "Chef",
        price: 15.99,
        description: "Traditional Italian lasagna with homemade pasta, rich meat sauce, and three types of cheese.",
        location: chefData.user_metadata?.location || "Location unknown"
      },
      {
        id: "102",
        name: "Tuscan Ribollita Soup",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        chefName: chefData.user_metadata?.name || "Chef",
        price: 12.50,
        description: "Hearty Tuscan bread soup with seasonal vegetables, cannellini beans, and a drizzle of Tuscan olive oil.",
        location: chefData.user_metadata?.location || "Location unknown"
      }
    ];

    const sampleReviews = [
      {
        id: "201",
        user: "John D.",
        rating: 5,
        date: "2023-08-15",
        comment: "Amazing food and service!"
      },
      {
        id: "202",
        user: "Sarah M.",
        rating: 4,
        date: "2023-07-23",
        comment: "Really enjoyed the meal. Will order again!"
      }
    ];

    return {
      id: chefData.id,
      name: chefData.user_metadata?.name || "Chef",
      location: chefData.user_metadata?.location || "Location unknown",
      profileImage: chefData.user_metadata?.profile_image || "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=384&q=80",
      bio: chefData.user_metadata?.about || "No bio available",
      cuisineSpecialty: "Italian", // This should come from the API
      rating: 4.8, // This should come from the API
      reviewCount: 32, // This should come from the API
      yearsExperience: chefData.user_metadata?.experience || "Not specified",
      meals: sampleMeals,
      reviews: sampleReviews
    };
  } catch (error) {
    console.error("Error fetching chef data:", error);
    throw error;
  }
};
