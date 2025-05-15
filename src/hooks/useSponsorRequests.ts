
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import requestService, { Request } from "@/services/requestService";

export const useSponsorRequests = () => {
  const { user, token } = useAuth();
  
  // Function to calculate the total amount of a request by summing all bill amounts
  const calculateRequestAmount = (request: Request): number => {
    return request.bills.reduce((total, bill) => total + bill.amount, 0);
  };
  
  // Query to fetch requests
  const {
    data: requestsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["sponsor-requests", user?.id],
    queryFn: async () => {
      if (!user?.id || !token) {
        console.error("User ID or token not available");
        throw new Error("Authentication required");
      }
      
      const response = await requestService.getSponsorRequests(user.id, token);
      
      // Process the data before returning it
      if (response.success && response.data) {
        return response.data.map(request => ({
          ...request,
          // Add a calculated totalAmount property
          totalAmount: calculateRequestAmount(request),
          // Generate a simple request ID (e.g., REQ-001) based on index
          displayId: `REQ-${request.id.substring(0, 3)}`,
        }));
      }
      
      return [];
    },
    enabled: !!user?.id && !!token,
  });

  // Summary data calculations
  const requestsCount = requestsData?.length || 0;
  const approvedRequests = requestsData?.filter(req => req.status === "APPROVED").length || 0;
  const pendingRequests = requestsData?.filter(req => req.status === "PENDING").length || 0;
  const rejectedRequests = requestsData?.filter(req => req.status === "REJECTED").length || 0;
  
  return {
    requests: requestsData || [],
    isLoading,
    error,
    refetch,
    // Summary data
    requestsCount,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
  };
};
