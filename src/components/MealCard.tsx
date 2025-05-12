
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MealCardProps {
  id: string; // Changed from number to string to match the API's dish ID type
  name: string;
  image: string;
  chefName: string;
  price: number;
  description?: string;
  location?: string;
  cuisine?: string;
  dietary?: string[];
  className?: string;
}

const MealCard = ({
  id,
  name,
  image,
  chefName,
  price,
  description = "",
  location = "",
  cuisine = "",
  dietary = [],
  className = ""
}: MealCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md ${className}`}>
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-48 w-full object-cover"
        />
        {cuisine && (
          <Badge className="absolute top-2 right-2">
            {cuisine}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 dark:text-gray-400">By {chefName}</p>
        
        {description && (
          <p className="text-sm line-clamp-2 mb-2">{description}</p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          
          {location && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{location}</span>
          )}
        </div>
        
        {dietary && dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dietary.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Link to={`/order/${id}`} className="w-full">
          <Button className="w-full">Order Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MealCard;
