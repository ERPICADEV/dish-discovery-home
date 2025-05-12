
import React from "react";
import { Hosting } from "@/services/hosting";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users } from "lucide-react";

interface HostingCardProps {
  hosting: Hosting;
  onBookNowClick: (hosting: Hosting) => void;
}

export const HostingCard = ({ hosting, onBookNowClick }: HostingCardProps) => {
  return (
    <Card key={hosting.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{hosting.title}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin size={16} className="mr-1" /> {hosting.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
