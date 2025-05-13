
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MealCard from '@/components/MealCard';
import { User } from '@/services/auth';
import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Type definitions for chef profile data
interface ChefProfile {
  id: string;
  name: string;
  location: string;
  profileImage: string;
  bio: string;
  cuisineSpecialty: string;
  rating: number;
  reviewCount: number;
  yearsExperience: string;
  meals: Meal[];
  reviews: Review[];
}

interface Meal {
  id: string;
  name: string;
  image: string;
  chefName: string;
  price: number;
  description: string;
  location: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}

// Fetch chef data from API
const fetchChefData = async (chefId: string): Promise<ChefProfile> => {
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

const ChefProfile = () => {
  const [activeTab, setActiveTab] = useState("meals");
  const { chefId } = useParams<{ chefId: string }>();
  const navigate = useNavigate();
  
  const { data: chef, isLoading, error } = useQuery({
    queryKey: ['chef', chefId],
    queryFn: () => chefId ? fetchChefData(chefId) : Promise.reject("No chef ID provided"),
    enabled: !!chefId,
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (error) {
      toast({
        title: "Error loading chef profile",
        description: "Could not load the chef's information.",
        variant: "destructive",
      });
    }
  }, [error]);

  const starRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600 text-sm">
          {rating} ({chef?.reviewCount || 0} reviews)
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-idish-orange" />
        <span className="ml-2">Loading chef profile...</span>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chef Not Found</h2>
          <p>We couldn't find information for this chef.</p>
          <Button 
            onClick={() => navigate('/browse')} 
            className="mt-4"
          >
            Browse Chefs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Chef Hero Banner */}
      <div className="bg-gradient-to-r from-idish-peach to-white py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-md">
              {chef.profileImage ? (
                <AvatarImage 
                  src={chef.profileImage} 
                  alt={chef.name}
                  className="h-full w-full object-cover" 
                />
              ) : (
                <AvatarFallback className="text-3xl">
                  {chef.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{chef.name}</h1>
              <div className="flex items-center justify-center md:justify-start mb-2">
                <svg
                  className="w-5 h-5 text-gray-600 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600">{chef.location}</span>
              </div>
              <div className="mb-4 flex justify-center md:justify-start">
                {starRating(chef.rating)}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-idish-green px-3 py-1 rounded-full text-sm">
                  {chef.cuisineSpecialty}
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {chef.yearsExperience} experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">About {chef.name}</h2>
          <p className="text-gray-700">{chef.bio}</p>
        </div>

        <Tabs defaultValue="meals" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meals" className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">{chef.name}'s Meals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chef.meals.map((meal) => (
                <MealCard key={meal.id} {...meal} chefId={chef.id} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {chef.reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{review.user}</span>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to try {chef.name}'s cooking?</h3>
          <Button className="bg-idish-orange hover:bg-orange-600">Place An Order</Button>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;
