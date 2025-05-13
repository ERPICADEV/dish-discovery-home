
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getStoredChefProfile, ChefProfile } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const navigate = useNavigate();
  const { data: chefProfile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const profile = getStoredChefProfile();
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-idish-orange border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!chefProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Not Found</h2>
        <p className="text-gray-600 mb-6 text-center">
          Your profile information couldn't be loaded. Please try again later.
        </p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-idish-peach to-white p-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your chef profile and information</p>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <img
                src={chefProfile.image_url || "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=384&q=80"}
                alt={chefProfile.name}
                className="h-36 w-36 object-cover rounded-full border-4 border-white shadow-md"
              />
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{chefProfile.name}</h2>
                  <div className="flex items-center justify-center md:justify-start mt-1 text-gray-600">
                    <svg
                      className="w-5 h-5 mr-1"
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
                    <span>{chefProfile.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {chefProfile.cuisine_specialty && (
                    <span className="bg-idish-green px-3 py-1 rounded-full text-sm">
                      {chefProfile.cuisine_specialty}
                    </span>
                  )}
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {chefProfile.experience}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">About</h3>
                <p className="text-gray-700">{chefProfile.about}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-700">Phone: {chefProfile.phone}</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center md:justify-end">
              <Button variant="outline" className="mr-4">Edit Profile</Button>
              <Button>Manage Meals</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
