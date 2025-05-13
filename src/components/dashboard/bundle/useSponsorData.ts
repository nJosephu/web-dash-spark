
import { useState, useEffect } from "react";
import { Sponsor } from "@/types/sponsor"; // Updated import path
import { useSponsors } from "@/services/sponsorsService";

export function useSponsorData() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const { sponsors: apiSponsors, isLoading } = useSponsors();

  // Fetch sponsor data from the API
  useEffect(() => {
    if (apiSponsors && apiSponsors.length > 0) {
      // Map API response to the format expected by the app
      const formattedSponsors: Sponsor[] = apiSponsors.map(sponsor => ({
        id: sponsor.id,
        name: sponsor.name,
        avatar: sponsor.name.split(' ').map(name => name[0]).join(''),
        email: sponsor.email,
        sponsoredAmount: "₦0", // Default value as this isn't in the API
        activeRequests: 0, // Default value as this isn't in the API
        joinedDate: new Date(sponsor.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        verified: true, // Default value as this isn't in the API
        rating: 5.0, // Default value as this isn't in the API
      }));

      console.log("Formatted sponsors:", formattedSponsors);
      setSponsors(formattedSponsors);
    } else if (!isLoading) {
      // If API returns empty and not loading, use fallback data
      const sponsorsData: Sponsor[] = [
        {
          id: "1",
          name: "John Doe",
          avatar: "JD",
          sponsoredAmount: "₦350,000",
          activeRequests: 2,
          joinedDate: "Jan 2025",
          verified: true,
          rating: 4.8,
          email: "thismanthisman619@gmail.com",
        },
        {
          id: "2",
          name: "Sarah Williams",
          avatar: "SW",
          sponsoredAmount: "₦280,000",
          activeRequests: 1,
          joinedDate: "Feb 2025",
          verified: true,
          rating: 4.9,
          email: "sponsor2@example.com",
        },
        {
          id: "3",
          name: "Michael Brown",
          avatar: "MB",
          sponsoredAmount: "₦420,000",
          activeRequests: 3,
          joinedDate: "Dec 2024",
          verified: true,
          rating: 4.7,
          email: "sponsor3@example.com",
        },
        {
          id: "4",
          name: "Lisa Johnson",
          avatar: "LJ",
          sponsoredAmount: "₦175,000",
          activeRequests: 1,
          joinedDate: "Mar 2025",
          verified: false,
          rating: 4.6,
          email: "sponsor4@example.com",
        },
      ];
      
      setSponsors(sponsorsData);
    }
  }, [apiSponsors, isLoading]);

  return sponsors;
}
