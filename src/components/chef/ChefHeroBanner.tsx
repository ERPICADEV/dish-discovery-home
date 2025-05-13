
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin } from 'lucide-react';
import { ChefProfile } from '@/types/chef';
import { StarRating } from './StarRating';

interface ChefHeroBannerProps {
  chef: ChefProfile;
}

export const ChefHeroBanner = ({ chef }: ChefHeroBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-idish-peach to-white py-10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-md">
            {chef.profileImage ? (
              <AvatarImage 
                src={chef.profileImage} 
                alt={chef.name}
                className="h-full w-full object-cover" 
              />
            ) : (
              <AvatarFallback className="text-3xl">
                {chef.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{chef.name}</h1>
            <div className="flex items-center justify-center md:justify-start mb-2">
              <MapPin className="w-5 h-5 text-gray-600 mr-1" />
              <span className="text-gray-600">{chef.location}</span>
            </div>
            <div className="mb-4 flex justify-center md:justify-start">
              <StarRating rating={chef.rating} reviewCount={chef.reviewCount} />
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-idish-green px-3 py-1 rounded-full text-sm">
                {chef.cuisineSpecialty}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {chef.yearsExperience} experience
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
