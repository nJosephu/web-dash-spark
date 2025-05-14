
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import requestService, { Request } from "@/services/requestService";

export const useRequests = () => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  
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
    queryKey: ["requests", user?.id],
    queryFn: async () => {
      if (!user?.id || !token) {
        console.error("User ID or token not available");
        throw new Error("Authentication required");
      }
      const response = await requestService.getUserRequests(user.id, token);
      
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
  
  // Mutation to cancel a request
  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (!token) throw new Error("Authentication required");
      return await requestService.cancelRequest(requestId, token);
    },
    onSuccess: () => {
      toast.success("Request cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["requests", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel request: ${error.message}`);
    },
  });
  
  // Mutation to send a reminder
  const sendReminderMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (!token) throw new Error("Authentication required");
      return await requestService.sendReminder(requestId, token);
    },
    onSuccess: () => {
      toast.success("Reminder sent successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reminder: ${error.message}`);
    },
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
    cancelRequest: cancelRequestMutation.mutate,
    sendReminder: sendReminderMutation.mutate,
    // Summary data
    requestsCount,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
  };
};
