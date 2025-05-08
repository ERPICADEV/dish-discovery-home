
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MealCardProps {
  id: number;
  name: string;
  image: string;
  chefName: string;
  price: number;
  description: string;
  location: string;
  className?: string;
}

const MealCard = ({
  id,
  name,
  image,
  chefName,
  price,
  description,
  location,
  className,
}: MealCardProps) => {
  return (
    <Link to={`/meal/${id}`} className={cn("block", className)}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{name}</h3>
            <span className="bg-idish-yellow px-3 py-1 rounded-full text-sm font-medium">
              ${price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">By {chefName}</p>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>
          <div className="flex items-center text-gray-500 text-xs">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MealCard;
