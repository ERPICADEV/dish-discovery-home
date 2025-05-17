
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MealCard from '@/components/MealCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { getAllDishes, Dish } from '@/services/dishes';
import { toast } from '@/hooks/use-toast';

const dietaryOptions = ["All", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Alphabetical"];

const Browse = () => {
  const [filteredMeals, setFilteredMeals] = useState<Dish[]>([]);
  const [allMeals, setAllMeals] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cuisineOptions, setCuisineOptions] = useState<string[]>(["All"]);
  
  // New state for chefs data
  const [chefsMap, setChefsMap] = useState<Record<string, string>>({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setIsLoading(true);
      const dishes = await getAllDishes();
      setAllMeals(dishes);
      setFilteredMeals(dishes);
      
      // Extract unique cuisine types
      const cuisines = ["All", ...new Set(dishes.map(dish => dish.cuisine_type))];
      setCuisineOptions(cuisines);
      
      // Create a map of chef IDs to names
      // In a real application, this would fetch chef data from an API
      // For now we'll use placeholder names based on the chef_id
      const chefNames: Record<string, string> = {};
      dishes.forEach(dish => {
        if (!chefNames[dish.chef_id]) {
          // Generate a chef name from ID for demonstration
          // In a real app, you would fetch this from the database
          const shortId = dish.chef_id.substring(0, 6);
          chefNames[dish.chef_id] = `Chef ${shortId}`;
        }
      });
      setChefsMap(chefNames);
    } catch (error) {
      console.error("Error fetching dishes:", error);
      toast({
        title: "Error",
        description: "Failed to load dishes. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = [...allMeals];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(meal => 
        meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter !== "All") {
      result = result.filter(meal => meal.cuisine_type === cuisineFilter);
    }
    
    // Apply dietary filter (assuming we have this data in the future)
    if (dietaryFilter !== "All") {
      // This is a placeholder - we would need to add dietary info to the dishes API
      // result = result.filter(meal => meal.dietary.includes(dietaryFilter));
    }
    
    // Apply sorting
    switch(sortBy) {
      case "Price: Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Recommended - no specific sorting
        break;
    }
    
    setFilteredMeals(result);
  }, [searchQuery, cuisineFilter, dietaryFilter, sortBy, allMeals]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-idish-peach to-white dark:bg-dark-browse-gradient py-10 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Discover Local Homemade Meals</h1>
          <p className="text-lg text-gray-700 dark:text-dark-text mb-6 max-w-2xl">
            Browse delicious meals prepared with love by passionate home chefs in your area.
          </p>
          
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search meals, chefs, or cuisines..."
                className="pl-10 py-6 rounded-md dark:bg-dark-card dark:border-dark-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="md:hidden flex items-center gap-2 dark:bg-dark-card dark:text-dark-text dark:border-dark-border"
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
            >
              <Filter size={20} />
              Filters
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container-custom mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 space-y-6 flex-shrink-0">
            <div>
              <h3 className="font-semibold mb-3 flex items-center dark:text-dark-text">
                <Filter size={18} className="mr-2" />
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-300">Cuisine</label>
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger className="w-full dark:bg-dark-card dark:border-dark-border">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineOptions.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-300">Dietary</label>
                  <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                    <SelectTrigger className="w-full dark:bg-dark-card dark:border-dark-border">
                      <SelectValue placeholder="Dietary needs" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-300">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full dark:bg-dark-card dark:border-dark-border">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden bg-white dark:bg-dark-card p-4 rounded-lg shadow mb-4">
              <h3 className="font-semibold mb-3 dark:text-dark-text">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-300">Cuisine</label>
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger className="w-full dark:bg-dark-card dark:border-dark-border">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineOptions.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-300">Dietary</label>
                  <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                    <SelectTrigger className="w-full dark:bg-dark-card dark:border-dark-border">
                      <SelectValue placeholder="Dietary needs" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietaryOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block dark:text-gray-300">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full dark:bg-dark-card dark:border-dark-border">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          {/* Results */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-dark-text">
                {isLoading ? (
                  "Loading dishes..."
                ) : (
                  `${filteredMeals.length} ${filteredMeals.length === 1 ? 'result' : 'results'}`
                )}
              </h2>
              <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-9 dark:bg-dark-card dark:border-dark-border">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-gray-100 dark:bg-dark-card rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.length > 0 ? (
                  filteredMeals.map(dish => (
                    <MealCard 
                      key={dish.id} 
                      id={dish.id} 
                      name={dish.title}
                      image={dish.image_url || "/placeholder.svg"}
                      chefName={chefsMap[dish.chef_id] || `Chef #${dish.chef_id.substring(0, 6)}`}
                      price={dish.price}
                      description={dish.description}
                      location="Local Area"
                      cuisine={dish.cuisine_type}
                      dietary={[]}
                      className="animate-fade-in" 
                      chefId={dish.chef_id} // Pass chef ID for linking to chef profile
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No meals found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
