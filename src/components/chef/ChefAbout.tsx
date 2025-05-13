
import { ChefProfile } from '@/types/chef';

interface ChefAboutProps {
  chef: ChefProfile;
}

export const ChefAbout = ({ chef }: ChefAboutProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
      <h2 className="text-xl font-semibold mb-4">About {chef.name}</h2>
      <p className="text-gray-700">{chef.bio}</p>
    </div>
  );
};
