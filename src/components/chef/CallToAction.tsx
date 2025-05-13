
import { ChefProfile } from '@/types/chef';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  chef: ChefProfile;
}

export const CallToAction = ({ chef }: CallToActionProps) => {
  return (
    <div className="mt-12 text-center">
      <h3 className="text-xl font-semibold mb-4">Ready to try {chef.name}'s cooking?</h3>
      <Button className="bg-idish-orange hover:bg-orange-600">Place An Order</Button>
    </div>
  );
};
