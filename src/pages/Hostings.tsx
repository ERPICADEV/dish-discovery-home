import { useState } from "react";
import { Hosting } from "@/services/hosting";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { HostingsList } from "@/components/hosting/HostingsList";
import { SearchBar } from "@/components/hosting/SearchBar";
import { useHostings } from "@/hooks/useHostings";
import { useNavigate } from "react-router-dom";

const Hostings = () => {
  const { filteredHostings, isLoading, searchQuery, setSearchQuery } = useHostings();
  const { isLoggedIn, isCustomer } = useAuth();
  const navigate = useNavigate();

  const handleBookNowClick = (hosting: Hosting) => {
    console.log('=== Book Now Click Debug ===');
    console.log('1. User auth state:', {
      isLoggedIn,
      isCustomer,
      hasToken: !!localStorage.getItem("token")
    });
    console.log('2. Selected hosting:', hosting);

    // Navigate to the booking page
    navigate(`/book-hosting/${hosting.id}`);
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
    </div>
  );
};

export default Hostings;
