
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import requestService from "@/services/requestService";
import { useMemo } from "react";

interface Sponsor {
  id: string;
  name: string;
  email?: string;
  requestsCount: number;
  totalAmount: number;
  lastActivity: string;
}

export const useRequestSponsors = () => {
  const { user, token } = useAuth();
  
  const {
    data: requestsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-requests-sponsors", user?.id],
    queryFn: async () => {
      if (!user?.id || !token) {
        throw new Error("Authentication required");
      }
      
      const response = await requestService.getUserRequests(user.id, token);
      return response.success ? response.data : [];
    },
    enabled: !!user?.id && !!token,
  });
  
  // Extract unique sponsors from requests and calculate their stats
  const sponsors = useMemo(() => {
    if (!requestsData || requestsData.length === 0) return [];
    
    const sponsorMap = new Map<string, Sponsor>();
    
    requestsData.forEach(request => {
      if (request.supporter) {
        const { id, name, email } = request.supporter;
        
        // Calculate total amount from all bills in this request
        const requestAmount = request.bills.reduce((total, bill) => total + bill.amount, 0);
        
        if (sponsorMap.has(id)) {
          // Update existing sponsor data
          const existingSponsor = sponsorMap.get(id)!;
          sponsorMap.set(id, {
            ...existingSponsor,
            requestsCount: existingSponsor.requestsCount + 1,
            totalAmount: existingSponsor.totalAmount + requestAmount,
            lastActivity: new Date(request.createdAt) > new Date(existingSponsor.lastActivity) 
              ? request.createdAt 
              : existingSponsor.lastActivity
          });
        } else {
          // Add new sponsor
          sponsorMap.set(id, {
            id,
            name,
            email,
            requestsCount: 1,
            totalAmount: requestAmount,
            lastActivity: request.createdAt
          });
        }
      }
    });
    
    return Array.from(sponsorMap.values());
  }, [requestsData]);
  
  return {
    sponsors,
    isLoading,
    error,
    sponsorCount: sponsors.length,
    totalFunded: sponsors.reduce((total, sponsor) => total + sponsor.totalAmount, 0)
  };
};
