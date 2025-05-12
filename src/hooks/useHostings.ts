
import { useState, useEffect } from "react";
import { getAllHostings, Hosting } from "@/services/hosting";
import { toast } from "@/hooks/use-toast";

export const useHostings = () => {
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [filteredHostings, setFilteredHostings] = useState<Hosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all hostings
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

  // Filter hostings based on search query
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

  return {
    hostings,
    filteredHostings,
    isLoading,
    searchQuery,
    setSearchQuery
  };
};
