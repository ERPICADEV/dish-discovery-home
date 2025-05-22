import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Hosting, getHostingById } from "@/services/hosting";
import { BookingForm, BookingFormData } from "@/components/hosting/BookingForm";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { createBooking } from "@/services/bookings";

const BookHosting = () => {
  const { hostingId } = useParams<{ hostingId: string }>();
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHosting = async () => {
      if (!hostingId) return;
      setIsLoading(true);
      try {
        const hostingData = await getHostingById(hostingId);
        setHosting(hostingData);
      } catch (error) {
        console.error("Failed to fetch hosting details:", error);
        toast({
          title: "Error",
          description: "Failed to load hosting details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHosting();
  }, [hostingId]);

  const onBookingSubmit = async (data: BookingFormData) => {
    if (!hostingId) return;
    try {
      await createBooking({
        hosting_id: hostingId,
        seats: data.seats,
        booking_date: data.booking_date,
        time_slot: data.time_slot
      });

      toast({
        title: "Booking Confirmed!",
        description: `You have successfully booked ${data.seats} seat(s) for "${hosting?.title}".`,
      });
      
      // Optionally navigate the user to their bookings page or a confirmation page
      // navigate('/my-bookings'); 

    } catch (error) {
      console.error("Failed to book hosting:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16 text-center">
        <p>Loading hosting details...</p>
      </div>
    );
  }

  if (!hosting) {
    return (
      <div className="container-custom py-16 text-center">
        <p>Hosting not found.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-6">Book Your Culinary Experience</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Hosting Details Column */}
        <div>
           <Card>
            <CardHeader>
              <CardTitle>{hosting.title}</CardTitle>
              <CardDescription>{hosting.location}</CardDescription>
            </CardHeader>
            <CardContent>
              {hosting.image_url && (
                <div className="w-full mb-4 rounded-md overflow-hidden">
                   <AspectRatio ratio={16 / 9}>
                     <img 
                       src={hosting.image_url} 
                       alt={hosting.title} 
                       className="object-cover w-full h-full"
                     />
                   </AspectRatio>
                </div>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{hosting.description}</p>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Price per guest:</span>
                <span>${hosting.price_per_guest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Max guests:</span>
                <span>{hosting.max_guests}</span>
              </div>
               <div className="mt-4">
                <h4 className="font-medium mb-2 text-sm">Available days:</h4>
                <div className="flex flex-wrap gap-1">
                  {hosting.available_days.map((day) => (
                    <Badge key={day} variant="secondary">{day}</Badge>
                  ))}
                </div>
              </div>
               <div className="mt-2">
                <h4 className="font-medium mb-2 text-sm">Available time slots:</h4>
                <div className="flex flex-wrap gap-1">
                  {hosting.time_slots.map((slot) => (
                    <Badge key={slot} variant="secondary">{slot}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Booking Form Column */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Fill out the form to confirm your booking.</CardDescription>
            </CardHeader>
            <CardContent>
               <BookingForm 
                selectedHosting={hosting} 
                onSubmit={onBookingSubmit} 
                onCancel={() => { /* Handle cancel on page */ }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookHosting; 