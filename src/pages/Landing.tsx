
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TestimonialCard from '@/components/TestimonialCard';
import HowItWorksStep from '@/components/HowItWorksStep';
import MealCard from '@/components/MealCard';
import { useEffect } from 'react';

// Sample meals data
const featuredMeals = [
  {
    id: 1,
    name: "Homemade Lasagna",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80",
    chefName: "Maria Rossi",
    price: 15.99,
    description: "Traditional Italian lasagna with homemade pasta, rich meat sauce, and three types of cheese.",
    location: "Brooklyn, NY"
  },
  {
    id: 2,
    name: "Spicy Thai Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    chefName: "Anong Suk",
    price: 13.50,
    description: "Authentic red curry with fresh vegetables and your choice of chicken or tofu.",
    location: "Queens, NY"
  },
  {
    id: 3,
    name: "Southern Fried Chicken",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80",
    chefName: "James Brown",
    price: 14.75,
    description: "Crispy fried chicken with secret spice blend, served with homemade cornbread and gravy.",
    location: "Harlem, NY"
  },
];

// Sample testimonials data
const testimonials = [
  {
    content: "iDISH has completely changed how I eat during the week. I get to enjoy incredible home-cooked meals that are way better than any takeout.",
    author: "Sarah Johnson",
    role: "Customer"
  },
  {
    content: "As a home chef, iDISH has allowed me to share my passion for cooking and earn money doing what I love. The platform is so easy to use!",
    author: "Michael Chen",
    role: "Home Chef"
  },
  {
    content: "I've discovered amazing food from different cultures that I would never have tried otherwise. Every meal feels special and personal.",
    author: "Priya Patel",
    role: "Customer"
  }
];

const Landing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-idish-peach to-white py-16 md:py-24">
        <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
          <div className="text-left space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Real Food,<br />
              Real Chefs,<br />
              <span className="text-idish-orange">Real Home.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg">
              Discover homemade meals prepared by passionate local chefs
              in your neighborhood.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-idish-orange hover:bg-orange-600 text-white">
                <Link to="/browse">Browse Dishes</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-idish-orange text-idish-orange hover:bg-idish-peach hover:text-idish-orange">
                <Link to="/chef-signup">Become a Chef</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-idish-yellow rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-idish-green rounded-full opacity-40"></div>
            <img 
              src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
              alt="Chef cooking at home"
              className="rounded-xl shadow-2xl relative z-10 object-cover w-full max-h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How iDISH Works</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <HowItWorksStep
              number={1}
              title="Browse & Choose"
              description="Explore meals from local chefs in your area. Filter by cuisine, dietary needs, or delivery options."
              icon={
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              }
            />
            <HowItWorksStep
              number={2}
              title="Order & Pay"
              description="Place your order securely through our platform and pay online. Communicate directly with the chef if needed."
              icon={
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              }
            />
            <HowItWorksStep
              number={3}
              title="Enjoy Your Meal"
              description="Pick up your meal at the scheduled time or have it delivered. Enjoy authentic homemade food from talented chefs."
              icon={
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Meals</h2>
            <Button asChild variant="ghost" className="text-idish-orange hover:text-orange-600 hover:bg-transparent p-0">
              <Link to="/browse">View all dishes</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMeals.map((meal) => (
              <MealCard key={meal.id} {...meal} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose iDISH?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="bg-idish-peach/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">For Food Lovers</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-idish-orange mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Authentic Home Cooking</h4>
                    <p className="text-gray-600">Enjoy dishes made with love, not from a commercial kitchen</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-idish-orange mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Cultural Diversity</h4>
                    <p className="text-gray-600">Discover unique family recipes and cultural specialties</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-idish-orange mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Support Local</h4>
                    <p className="text-gray-600">Connect with and support talented cooks in your community</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* For Chefs */}
            <div className="bg-idish-green/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">For Home Chefs</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-idish-orange mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Earn From Your Passion</h4>
                    <p className="text-gray-600">Turn your cooking skills into a flexible source of income</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-idish-orange mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Build Your Brand</h4>
                    <p className="text-gray-600">Create a following for your unique culinary creations</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-idish-orange mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Flexible Schedule</h4>
                    <p className="text-gray-600">Cook on your own terms and set your own availability</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-idish-orange text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to share your culinary creations?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of passionate home chefs and start earning from your kitchen today.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white hover:bg-gray-100 text-idish-orange">
            <Link to="/chef-signup">Become a Chef</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
