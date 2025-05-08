
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MealCard from '@/components/MealCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, GridIcon, ListFilter, Search } from 'lucide-react';

// Sample meals data - expanded dataset
const sampleMeals = [
  {
    id: 1,
    name: "Homemade Lasagna",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
    chefName: "Maria Rossi",
    price: 15.99,
    description: "Traditional Italian lasagna with homemade pasta, rich meat sauce, and three types of cheese.",
    location: "Brooklyn, NY",
    cuisine: "Italian",
    dietary: ["Dairy"]
  },
  {
    id: 2,
    name: "Spicy Thai Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    chefName: "Anong Suk",
    price: 13.50,
    description: "Authentic red curry with fresh vegetables and your choice of chicken or tofu.",
    location: "Queens, NY",
    cuisine: "Thai",
    dietary: ["Gluten-Free"]
  },
  {
    id: 3,
    name: "Southern Fried Chicken",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    chefName: "James Brown",
    price: 14.75,
    description: "Crispy fried chicken with secret spice blend, served with homemade cornbread and gravy.",
    location: "Harlem, NY",
    cuisine: "American",
    dietary: []
  },
  {
    id: 4,
    name: "Vegetarian Paella",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    chefName: "Carlos Mendez",
    price: 16.50,
    description: "Saffron-infused rice with seasonal vegetables and aromatic spices.",
    location: "Lower East Side, NY",
    cuisine: "Spanish",
    dietary: ["Vegetarian", "Gluten-Free"]
  },
  {
    id: 5,
    name: "Homestyle Chicken Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    chefName: "Priya Sharma",
    price: 15.25,
    description: "Fragrant basmati rice layered with tender chicken and aromatic spices.",
    location: "Jackson Heights, NY",
    cuisine: "Indian",
    dietary: ["Dairy-Free"]
  },
  {
    id: 6,
    name: "Vegan Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    chefName: "Emma Chen",
    price: 12.99,
    description: "Nutrient-rich bowl with quinoa, roasted vegetables, avocado, and homemade tahini dressing.",
    location: "Williamsburg, NY",
    cuisine: "Health",
    dietary: ["Vegan", "Gluten-Free"]
  },
  {
    id: 7,
    name: "Jamaican Jerk Chicken",
    image: "https://images.unsplash.com/photo-1532465614-6cc8d45f647f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
    chefName: "Robert Johnson",
    price: 14.50,
    description: "Grilled chicken marinated in authentic Jamaican spices, served with rice and peas.",
    location: "Flatbush, NY",
    cuisine: "Caribbean",
    dietary: ["Dairy-Free"]
  },
  {
    id: 8,
    name: "Korean Bibimbap",
    image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    chefName: "Min-Ji Park",
    price: 13.75,
    description: "Mixed rice bowl with vegetables, beef, a fried egg, and chili pepper paste.",
    location: "Flushing, NY",
    cuisine: "Korean",
    dietary: []
  },
  {
    id: 9,
    name: "Homemade Falafel Plate",
    image: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    chefName: "Ahmad Nassar",
    price: 11.99,
    description: "Crispy falafel served with hummus, tabbouleh, fresh vegetables, and warm pita.",
    location: "Astoria, NY",
    cuisine: "Middle Eastern",
    dietary: ["Vegetarian"]
  },
];

const cuisineOptions = ["All", "American", "Italian", "Thai", "Indian", "Spanish", "Korean", "Caribbean", "Middle Eastern", "Health"];
const dietaryOptions = ["All", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"];
const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Alphabetical"];

const Browse = () => {
  const [filteredMeals, setFilteredMeals] = useState(sampleMeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let result = [...sampleMeals];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(meal => 
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.chefName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter !== "All") {
      result = result.filter(meal => meal.cuisine === cuisineFilter);
    }
    
    // Apply dietary filter
    if (dietaryFilter !== "All") {
      result = result.filter(meal => meal.dietary.includes(dietaryFilter));
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
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Recommended - no specific sorting
        break;
    }
    
    setFilteredMeals(result);
  }, [searchQuery, cuisineFilter, dietaryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-idish-peach to-white py-10 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Local Homemade Meals</h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl">
            Browse delicious meals prepared with love by passionate home chefs in your area.
          </p>
          
          {/* Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search meals, chefs, or cuisines..."
                className="pl-10 py-6 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="md:hidden flex items-center gap-2"
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
              <h3 className="font-semibold mb-3 flex items-center">
                <ListFilter size={18} className="mr-2" />
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Cuisine</label>
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium mb-1 block">Dietary</label>
                  <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium mb-1 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
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
            <div className="md:hidden bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-semibold mb-3">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Cuisine</label>
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium mb-1 block">Dietary</label>
                  <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
                    <SelectTrigger className="w-full">
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
                  <label className="text-sm font-medium mb-1 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
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
              <h2 className="text-xl font-semibold">
                {filteredMeals.length} {filteredMeals.length === 1 ? 'result' : 'results'}
              </h2>
              <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-9">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.length > 0 ? (
                filteredMeals.map(meal => (
                  <MealCard 
                    key={meal.id} 
                    {...meal} 
                    className="animate-fade-in" 
                  />
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No meals found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
