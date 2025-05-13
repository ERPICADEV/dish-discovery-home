
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit2, User, MapPin, Mail, Phone, Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/services/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, isChef, isCustomer, logout } = useAuth();
  const navigate = useNavigate();

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading profile",
        description: "Could not load your profile information.",
        variant: "destructive",
      });
    }
  }, [error]);

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.substring(0, 2).toUpperCase() || "ID";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-idish-orange" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    {profileData?.user_metadata?.profile_image ? (
                      <AvatarImage src={profileData.user_metadata.profile_image} alt="Profile" />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {getInitials(profileData?.user_metadata?.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <CardTitle className="text-xl">
                  {profileData?.user_metadata?.name || profileData?.email}
                </CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {profileData?.user_metadata?.role || "User"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{profileData?.email}</span>
                  </div>
                  {isChef && profileData?.user_metadata && (
                    <>
                      {profileData.user_metadata.location && (
                        <div className="flex items-center gap-4">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <span>{profileData.user_metadata.location}</span>
                        </div>
                      )}
                      {profileData.user_metadata.phone && (
                        <div className="flex items-center gap-4">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span>{profileData.user_metadata.phone}</span>
                        </div>
                      )}
                      {profileData.user_metadata.experience && (
                        <div className="flex items-center gap-4">
                          <Star className="h-5 w-5 text-gray-400" />
                          <span>{profileData.user_metadata.experience} experience</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {isChef && profileData?.user_metadata?.about && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {profileData.user_metadata.about}
                  </p>
                </CardContent>
              </Card>
            )}

            {isChef && (
              <Tabs defaultValue="dishes" className="w-full">
                <TabsList>
                  <TabsTrigger value="dishes">Your Dishes</TabsTrigger>
                  <TabsTrigger value="hostings">Your Hostings</TabsTrigger>
                  <TabsTrigger value="orders">Your Orders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dishes">
                  <div className="mt-4">
                    <Button onClick={() => navigate('/dashboard')}>
                      Manage Dishes
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="hostings">
                  <div className="mt-4">
                    <Button onClick={() => navigate('/dashboard')}>
                      Manage Hostings
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="orders">
                  <div className="mt-4">
                    <Button onClick={() => navigate('/dashboard')}>
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
      </div>
    </div>
  );
};

export default Profile;
