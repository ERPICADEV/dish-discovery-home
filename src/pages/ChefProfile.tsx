
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { fetchChefData } from '@/services/chefProfile';
import { ChefHeroBanner } from '@/components/chef/ChefHeroBanner';
import { ChefAbout } from '@/components/chef/ChefAbout';
import { ChefMeals } from '@/components/chef/ChefMeals';
import { ChefReviews } from '@/components/chef/ChefReviews';
import { CallToAction } from '@/components/chef/CallToAction';

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
      <ChefHeroBanner chef={chef} />

      <div className="container-custom mt-8">
        <ChefAbout chef={chef} />

        <Tabs defaultValue="meals" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meals">
            <ChefMeals chef={chef} />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ChefReviews chef={chef} />
          </TabsContent>
        </Tabs>

        <CallToAction chef={chef} />
      </div>
    </div>
  );
};

export default ChefProfile;
