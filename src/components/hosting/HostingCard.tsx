
import React from "react";
import { Hosting } from "@/services/hosting";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Image } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HostingCardProps {
  hosting: Hosting;
  onBookNowClick: (hosting: Hosting) => void;
}

export const HostingCard = ({ hosting, onBookNowClick }: HostingCardProps) => {
  return (
    <Card key={hosting.id} className="overflow-hidden flex flex-col">
      {/* Image Section */}
      {hosting.image_url ? (
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={hosting.image_url} 
              alt={hosting.title}
              className="object-cover w-full h-full" 
            />
          </AspectRatio>
        </div>
      ) : (
        <div className="w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <AspectRatio ratio={16 / 9}>
            <div className="flex items-center justify-center h-full">
              <Image size={40} className="text-gray-400" />
            </div>
          </AspectRatio>
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle>{hosting.title}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin size={16} className="mr-1" /> {hosting.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-4">{hosting.description || "Join this exciting culinary experience!"}</p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Users size={16} className="mr-2 text-gray-500" />
            <span>Max {hosting.max_guests} guests</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {hosting.available_days.map(day => (
                <Badge key={day} variant="outline" className="capitalize">{day}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-2 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {hosting.time_slots.map(slot => (
                <Badge key={slot} variant="outline" className="capitalize">{slot}</Badge>
              ))}
            </div>
          </div>
          <div className="font-medium text-lg mt-2">
            ${hosting.price_per_guest.toFixed(2)} per guest
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onBookNowClick(hosting)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};
