import { useState, useEffect } from "react";
import { getUserBookings, Booking } from "@/services/bookings";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isCustomer } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(); // Use getUserBookings
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isCustomer) {
      fetchBookings();
    }
  }, [isCustomer]);

  if (!isCustomer) {
    return (
      <div className="container-custom py-16">
        <h1 className="text-3xl font-bold mb-6">Bookings</h1>
        <p>This page is only accessible to customers.</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  // Define a mapping from time string to the full descriptive string
  const timeStringDetails: { [key: string]: string } = {
    "08:00:00": "Breakfast (8AM - 10AM)",
    "13:00:00": "Lunch (12PM - 2PM)",
    "19:00:00": "Dinner (6PM - 8PM)",
    // Add other mappings as needed based on your available time slots
  };

  // Define BookingCard component within Bookings.tsx for now
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    const getStatusBadge = (status: Booking["status"]) => {
      switch (status) {
        case "pending":
          return <Badge variant="secondary">Pending</Badge>;
        case "confirmed":
          return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
        case "cancelled":
          return <Badge variant="destructive">Cancelled</Badge>;
        case "completed":
          return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
        default:
          return <Badge variant="secondary">{status}</Badge>;
      }
    };

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Booking for {booking.hosting?.title || "Unknown Hosting"}
            </CardTitle>
            {getStatusBadge(booking.status)}
          </div>
          <div className="mt-2">
            <CardDescription>Date: {formatDate(booking.date)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Number of Guests:</span>
              <span>{booking.number_of_guests}</span>
            </div>
             <div className="flex justify-between">
              <span className="text-gray-500">Time Slot:</span>
              <span>{timeStringDetails[booking.time_slot] || booking.time_slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Price:</span>
              <span className="font-medium">${booking.total_price.toFixed(2)}</span>
            </div>
            {booking.special_requests && (
              <div className="flex flex-col">
                <span className="text-gray-500">Special Requests:</span>
                <span className="mt-1">{booking.special_requests}</span>
              </div>
            )}
            {/* Optionally link to hosting details page */}
             {booking.hosting_id && (
              <Link to={`/book-hosting/${booking.hosting_id}`} className="text-sm text-blue-600 hover:underline">
                 View Hosting Details
              </Link>
             )}
          </div>
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">You haven't placed any bookings yet.</h2>
          <p className="text-gray-600 mb-6">
            Browse our available hostings and book your first culinary experience!
          </p>
           <Link to="/hostings">
             <Button>Browse Hostings</Button>
           </Link>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            {/* Add triggers for different statuses if needed */}
            {/*
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            */}
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          {/* Add TabsContent for different statuses if needed */}
          {/*
          <TabsContent value="active">
            <div className="grid gap-6 md:grid-cols-2">
              {bookings
                .filter((booking) => ["pending", "confirmed"].includes(booking.status))
                .map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-6 md:grid-cols-2">
              {bookings
                .filter((booking) => ["cancelled", "completed"].includes(booking.status))
                .map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
          </TabsContent>
          */}
        </Tabs>
      )}
    </div>
  );
};

export default Bookings; 