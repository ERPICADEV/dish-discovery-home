
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MealCard from '@/components/MealCard';
import { Dish, getAllDishes } from '@/services/dishes';
import { Button } from '@/components/ui/button';

export const FeaturedMeals = () => {
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const dishes = await getAllDishes();
        // Get featured dishes (limit to 3)
        const featured = dishes.slice(0, 3);
        setFeaturedDishes(featured);
      } catch (error) {
        console.error("Error fetching featured dishes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Meals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredDishes.length === 0) {
    return null;
  }

  return (
    <div className="container-custom py-16 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Featured Meals</h2>
        <Link to="/browse">
          <Button variant="link" className="text-idish-orange hover:text-orange-600">
            View all dishes
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredDishes.map((dish) => (
          <MealCard
            key={dish.id}
            id={dish.id}
            name={dish.title}
            image={dish.image_url || '/placeholder.svg'}
            chefName={'Chef'} // We'll need to get chef name separately or modify API
            price={dish.price}
            description={dish.description}
            cuisine={dish.cuisine_type}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedMeals;
