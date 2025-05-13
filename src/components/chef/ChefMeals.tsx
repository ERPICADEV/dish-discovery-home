
import { ChefProfile } from '@/types/chef';
import MealCard from '@/components/MealCard';

interface ChefMealsProps {
  chef: ChefProfile;
}

export const ChefMeals = ({ chef }: ChefMealsProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6">{chef.name}'s Meals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chef.meals.map((meal) => (
          <MealCard key={meal.id} {...meal} chefId={chef.id} />
        ))}
      </div>
    </div>
  );
};
