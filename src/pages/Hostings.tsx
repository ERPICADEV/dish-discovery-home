import { useState } from "react";
import { Hosting, bookHosting } from "@/services/hosting";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { BookingForm, BookingFormData } from "@/components/hosting/BookingForm";
import { HostingsList } from "@/components/hosting/HostingsList";
import { SearchBar } from "@/components/hosting/SearchBar";
import { useHostings } from "@/hooks/useHostings";

const Hostings = () => {
  const { filteredHostings, isLoading, searchQuery, setSearchQuery } = useHostings();
  const [selectedHosting, setSelectedHosting] = useState<Hosting | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { isLoggedIn, isCustomer } = useAuth();

  const handleBookNowClick = (hosting: Hosting) => {
    console.log('=== Book Now Click Debug ===');
    console.log('1. User auth state:', {
      isLoggedIn,
      isCustomer,
      hasToken: !!localStorage.getItem("token")
    });
    console.log('2. Selected hosting:', hosting);

    if (!isLoggedIn || !isCustomer) {
      console.log('3. Booking blocked - User not logged in or not a customer');
      toast({
        title: "Login Required",
        description: "Please log in as a customer to book a hosting.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedHosting(hosting);
    setIsBookingOpen(true);
  };

  const onBookingSubmit = async (data: BookingFormData) => {
    if (!selectedHosting) {
      return;
    }
    
    try {
      await bookHosting(selectedHosting.id, {
        seats: data.seats
      });

      toast({
        title: "Booking Confirmed!",
        description: `You have successfully booked ${data.seats} seat(s) for "${selectedHosting.title}".`,
      });
      
      setIsBookingOpen(false);
      setSelectedHosting(null);
    } catch (error) {
      console.error("Failed to book hosting:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-2">Culinary Experiences Near You</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Book a seat at a chef's table and enjoy a unique dining experience
      </p>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <HostingsList 
        hostings={filteredHostings}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onBookNowClick={handleBookNowClick}
      />
      
      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedHosting?.title}</DialogTitle>
            <DialogDescription>
              Fill out the form below to book your culinary experience.
            </DialogDescription>
          </DialogHeader>
          
          <BookingForm 
            selectedHosting={selectedHosting} 
            onSubmit={onBookingSubmit} 
            onCancel={() => setIsBookingOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hostings;
