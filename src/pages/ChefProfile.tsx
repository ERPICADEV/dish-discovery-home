
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MealCard from '@/components/MealCard';
import { getProfile, ChefProfile as ChefProfileType } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Sample data for reviews and meals - in a real app, these would come from an API
const sampleReviews = [
  {
    id: "201",
    user: "John D.",
    rating: 5,
    date: "2023-08-15",
    comment: "Incredible meals! Authentic flavors that transported me straight to another country. Will definitely order again!"
  },
  {
    id: "202",
    user: "Sarah M.",
    rating: 5,
    date: "2023-07-23",
    comment: "The food was perfect - not too spicy and had just the right amount of flavor. Very friendly when I picked up my order."
  },
  {
    id: "203",
    user: "Michael P.",
    rating: 4,
    date: "2023-06-10",
    comment: "Really enjoyed the meal. Full of flavor and very hearty. Would recommend to anyone looking for authentic home cooking."
  }
];

const sampleMeals = [
  {
    id: "101",
    name: "Homemade Lasagna",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
    price: 15.99,
    description: "Traditional Italian lasagna with homemade pasta, rich meat sauce, and three types of cheese.",
    location: ""
  },
  {
    id: "102",
    name: "Tuscan Ribollita Soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    price: 12.50,
    description: "Hearty Tuscan bread soup with seasonal vegetables, cannellini beans, and a drizzle of Tuscan olive oil.",
    location: ""
  },
  {
    id: "103",
    name: "Tiramisu",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
    price: 8.99,
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and creamy mascarpone.",
    location: ""
  }
];

const ChefProfile = () => {
  const [activeTab, setActiveTab] = useState("meals");
  const { chefId } = useParams();
  
  const { data: chefData, isLoading } = useQuery({
    queryKey: ['chefProfile', chefId],
    queryFn: async () => {
      try {
        const { chefProfile } = await getProfile();
        if (!chefProfile) {
          throw new Error('Chef profile not found');
        }
        return {
          ...chefProfile,
          meals: sampleMeals,
          reviews: sampleReviews,
          reviewCount: sampleReviews.length
        };
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load chef profile",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          {chefData?.rating || 0} ({chefData?.reviewCount || 0} reviews)
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-idish-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!chefData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Chef Profile Not Found</h2>
        <Link to="/browse">
          <Button>Return to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Chef Hero Banner */}
      <div className="bg-gradient-to-r from-idish-peach to-white py-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img
              src={chefData.image_url || "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=384&q=80"}
              alt={chefData.name}
              className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-md"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{chefData.name}</h1>
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
                <span className="text-gray-600">{chefData.location}</span>
              </div>
              <div className="mb-4 flex justify-center md:justify-start">
                {starRating(chefData.rating || 0)}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-idish-green px-3 py-1 rounded-full text-sm">
                  {chefData.cuisine_specialty || "Home Cooking"}
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {chefData.experience} experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">About {chefData.name}</h2>
          <p className="text-gray-700">{chefData.about}</p>
        </div>

        <Tabs defaultValue="meals" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meals" className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">{chefData.name}'s Meals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefData.meals.map((meal) => (
                <MealCard 
                  key={meal.id} 
                  {...meal} 
                  chefName={chefData.name}
                  chefId={chefId}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {chefData.reviews.map((review) => (
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
          <h3 className="text-xl font-semibold mb-4">Ready to try {chefData.name}'s cooking?</h3>
          <Button className="bg-idish-orange hover:bg-orange-600">Place An Order</Button>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;
