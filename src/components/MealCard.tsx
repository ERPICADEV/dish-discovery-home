import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import React, { useState } from 'react';

interface MealCardProps {
  id: string;
  name: string;
  image: string;
  chefName: string;
  price: number;
  description?: string;
  location?: string;
  cuisine?: string;
  dietary?: string[];
  className?: string;
  chefId?: string; // Added chef ID for linking to chef profile
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
  className = "",
  chefId
}: MealCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className={`overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md ${className}`}>
      {/* Image Section */}
      {image && image.trim() !== "" && !imgError ? (
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <img
              src={image}
              alt={name}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          </AspectRatio>
        </div>
      ) : (
        <div className="w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <AspectRatio ratio={16 / 9}>
            <div className="flex items-center justify-center h-full">
              <ImageIcon size={40} className="text-gray-400" />
            </div>
          </AspectRatio>
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        
        {/* Link to chef profile if we have a chefId */}
        {chefId ? (
          <Link to={`/chef/${chefId}`} className="text-gray-600 text-sm mb-2 dark:text-gray-400 hover:underline">
            By {chefName}
          </Link>
        ) : (
          <p className="text-gray-600 text-sm mb-2 dark:text-gray-400">By {chefName}</p>
        )}
        
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
      <CardFooter className="border-t p-4 flex justify-between">
        <Link to={`/order/${id}`} className="flex-1 mr-2">
          <Button className="w-full">Order Now</Button>
        </Link>
        
        {/* Add "View Chef" button */}
        {chefId && (
          <Link to={`/chef/${chefId}`} className="flex-1 ml-2">
            <Button variant="outline" className="w-full">Chef Details</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default MealCard;
