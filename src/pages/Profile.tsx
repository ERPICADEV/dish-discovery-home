import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, User, MapPin, Mail, Phone, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isChef, isCustomer, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="h-6 w-6 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              {isChef && (
                <>
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-gray-400" />
                    <span>{user?.user_metadata?.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-gray-400" />
                    <span>{user?.user_metadata?.phone}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Star className="h-6 w-6 text-gray-400" />
                    <span>{user?.user_metadata?.experience}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {isChef && (
          <Tabs defaultValue="dishes" className="w-full">
            <TabsList>
              <TabsTrigger value="dishes">Your Dishes</TabsTrigger>
              <TabsTrigger value="hostings">Your Hostings</TabsTrigger>
              <TabsTrigger value="orders">Your Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dishes">
              <div className="mt-4">
                <Button onClick={() => navigate('/chef-dashboard')}>
                  Manage Dishes
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hostings">
              <div className="mt-4">
                <Button onClick={() => navigate('/chef-dashboard')}>
                  Manage Hostings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="mt-4">
                <Button onClick={() => navigate('/chef-dashboard')}>
                  View Orders
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {isCustomer && (
          <Tabs defaultValue="orders" className="w-full">
            <TabsList>
              <TabsTrigger value="orders">Your Orders</TabsTrigger>
              <TabsTrigger value="hostings">Your Hostings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <div className="mt-4">
                <Button onClick={() => navigate('/orders')}>
                  View Orders
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="hostings">
              <div className="mt-4">
                <Button onClick={() => navigate('/hostings')}>
                  View Hostings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Profile;
