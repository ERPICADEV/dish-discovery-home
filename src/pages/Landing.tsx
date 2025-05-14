
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HowItWorksStep from "@/components/HowItWorksStep";
import TestimonialCard from "@/components/TestimonialCard";
import FeaturedMeals from "@/components/FeaturedMeals";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-idish-orange/90 to-idish-peach text-white">
        <div className="container-custom py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Home-Cooked Meals From Local Chefs
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover authentic dishes made with love, delivered to your door or enjoyed at a chef's table.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-white text-idish-orange hover:bg-gray-100"
              onClick={() => navigate("/browse")}
            >
              Browse Meals
            </Button>
            {!isLoggedIn && (
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Meals (now using real data) */}
      <FeaturedMeals />

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksStep
              number={1}
              title="Browse & Choose"
              description="Explore our diverse selection of meals from talented local chefs in your area."
            />
            <HowItWorksStep
              number={2}
              title="Place Your Order"
              description="Select your preferred dishes, delivery options, and schedule your meal."
            />
            <HowItWorksStep
              number={3}
              title="Enjoy Your Meal"
              description="Receive your freshly prepared meal and enjoy an authentic culinary experience."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah M."
              image="/placeholder.svg"
              rating={5}
              text="The chef's table experience was incredible! The food was amazing and the chef was so knowledgeable and friendly."
            />
            <TestimonialCard
              name="Michael L."
              image="/placeholder.svg"
              rating={4}
              text="Ordering through iDISH has completely changed how I think about takeout. The quality and variety is unmatched!"
            />
            <TestimonialCard
              name="Jennifer K."
              image="/placeholder.svg"
              rating={5}
              text="As someone with dietary restrictions, I appreciate how accommodating the chefs are. Delicious food that meets my needs!"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-idish-orange text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Home-Cooked Goodness?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join iDISH today and discover a world of authentic, homemade meals from talented chefs in your community.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-idish-orange hover:bg-gray-100"
            onClick={() => isLoggedIn ? navigate("/browse") : navigate("/signup")}
          >
            {isLoggedIn ? "Browse Meals" : "Sign Up Now"}
          </Button>
        </div>
      </section>
    </>
  );
};

export default Landing;
