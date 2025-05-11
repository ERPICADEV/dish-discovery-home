
import { useState, useEffect } from "react";
import { getAllHostings, Hosting } from "@/services/hosting";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Search, Calendar, MapPin, Clock, Users } from "lucide-react";

const Hostings = () => {
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [filteredHostings, setFilteredHostings] = useState<Hosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHostings = async () => {
      try {
        setIsLoading(true);
        const data = await getAllHostings();
        setHostings(data);
        setFilteredHostings(data);
      } catch (error) {
        console.error("Failed to fetch hostings:", error);
        toast({
          title: "Error",
          description: "Failed to load hostings. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHostings();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHostings(hostings);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = hostings.filter(
        hosting => 
          hosting.title.toLowerCase().includes(query) || 
          hosting.location.toLowerCase().includes(query) ||
          (hosting.description?.toLowerCase().includes(query))
      );
      setFilteredHostings(filtered);
    }
  }, [searchQuery, hostings]);

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-2">Culinary Experiences Near You</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Book a seat at a chef's table and enjoy a unique dining experience
      </p>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search for experiences by title, location, or description..."
          className="pl-10 py-6"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      ) : filteredHostings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostings.map((hosting) => (
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
                    <Calendar size={16} className="mr-2 text-gray-500" />
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
                <Button className="w-full">Book Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No hostings available</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? "Try adjusting your search." : "Check back soon for new culinary experiences!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Hostings;
