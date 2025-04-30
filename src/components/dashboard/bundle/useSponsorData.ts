
import { useState, useEffect } from "react";
import { Sponsor } from "@/types/bundle";

export function useSponsorData() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // Fetch sponsor data (in a real app this would come from an API)
  useEffect(() => {
    // Using the sponsorsData from Sponsors.tsx
    const sponsorsData = [
      {
        id: 1,
        name: "John Doe",
        avatar: "JD",
        sponsoredAmount: "₦350,000",
        activeRequests: 2,
        joinedDate: "Jan 2025",
        verified: true,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Sarah Williams",
        avatar: "SW",
        sponsoredAmount: "₦280,000",
        activeRequests: 1,
        joinedDate: "Feb 2025",
        verified: true,
        rating: 4.9,
      },
      {
        id: 3,
        name: "Michael Brown",
        avatar: "MB",
        sponsoredAmount: "₦420,000",
        activeRequests: 3,
        joinedDate: "Dec 2024",
        verified: true,
        rating: 4.7,
      },
      {
        id: 4,
        name: "Lisa Johnson",
        avatar: "LJ",
        sponsoredAmount: "₦175,000",
        activeRequests: 1,
        joinedDate: "Mar 2025",
        verified: false,
        rating: 4.6,
      },
    ];
    
    setSponsors(sponsorsData);
  }, []);

  return sponsors;
}
