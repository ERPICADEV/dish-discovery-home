
import React from "react";
import { Hosting } from "@/services/hosting";
import { HostingCard } from "./HostingCard";

interface HostingsListProps {
  hostings: Hosting[];
  isLoading: boolean;
  searchQuery: string;
  onBookNowClick: (hosting: Hosting) => void;
}

export const HostingsList = ({
  hostings,
  isLoading,
  searchQuery,
  onBookNowClick,
}: HostingsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (hostings.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">No hostings available</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? "Try adjusting your search." : "Check back soon for new culinary experiences!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hostings.map((hosting) => (
        <HostingCard
          key={hosting.id}
          hosting={hosting}
          onBookNowClick={onBookNowClick}
        />
      ))}
    </div>
  );
};
