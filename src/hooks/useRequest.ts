
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import requestService, { Request, Bill } from "@/services/requestService";
import { format, parseISO } from "date-fns";

interface FormattedRequest extends Request {
  formattedId: string;
  totalAmount: number;
  formattedStatus: "pending" | "approved" | "rejected";
  formattedAmount: string;
  activityLog: ActivityLogItem[];
  earliestDueDate?: string;
}

interface ActivityLogItem {
  type: string;
  message: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  completed?: boolean;
}

export const useRequest = (requestId: string | undefined) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  
  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };
  
  // Find earliest due date from bills
  const getEarliestDueDate = (bills: Bill[]): string | undefined => {
    if (!bills || bills.length === 0) return undefined;
    
    return bills.reduce((earliest: string | undefined, bill) => {
      if (!earliest) return bill.dueDate;
      return new Date(bill.dueDate) < new Date(earliest) ? bill.dueDate : earliest;
    }, undefined);
  };

  // Query to fetch a single request by ID
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["request", requestId],
    queryFn: async () => {
      if (!requestId || !token) {
        throw new Error("Request ID or authentication required");
      }
      
      const response = await requestService.getRequestById(requestId, token);
      
      if (response.success && response.data) {
        const requestData = response.data;
        
        // Calculate total amount
        const totalAmount = requestData.bills.reduce((sum, bill) => sum + bill.amount, 0);
        
        // Format status to match expected types in components
        const formattedStatus = requestData.status.toLowerCase() as "pending" | "approved" | "rejected";
        
        // Create activity log
        const activityLog: ActivityLogItem[] = [
          {
            type: "created",
            message: `Request "${requestData.name}" created`,
            timestamp: requestData.createdAt,
            user: {
              name: requestData.requester.name
            },
            completed: true
          }
        ];
        
        // Add bill entries to activity log
        requestData.bills.forEach(bill => {
          activityLog.push({
            type: bill.status.toLowerCase(),
            message: `Bill "${bill.billName}" ${bill.status.toLowerCase()}`,
            timestamp: bill.dueDate,
            user: {
              name: "System"
            },
            completed: bill.status !== "PENDING"
          });
        });
        
        // Find earliest due date
        const earliestDueDate = getEarliestDueDate(requestData.bills);
        
        // Format the request data
        const formattedRequest: FormattedRequest = {
          ...requestData,
          formattedId: `UZK-${requestData.id.substring(0, 6)}`,
          totalAmount,
          formattedStatus,
          formattedAmount: formatCurrency(totalAmount),
          activityLog,
          earliestDueDate
        };
        
        return formattedRequest;
      }
      
      throw new Error("Failed to fetch request data");
    },
    enabled: !!requestId && !!token,
  });
  
  // Mutation to cancel a request
  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      if (!requestId || !token) throw new Error("Authentication required");
      return await requestService.cancelRequest(requestId, token);
    },
    onSuccess: () => {
      toast.success("Request cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel request: ${error.message}`);
    },
  });
  
  // Mutation to send a reminder
  const sendReminderMutation = useMutation({
    mutationFn: async () => {
      if (!requestId || !token) throw new Error("Authentication required");
      return await requestService.sendReminder(requestId, token);
    },
    onSuccess: () => {
      toast.success("Reminder sent successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reminder: ${error.message}`);
    },
  });
  
  // Calculate bill statistics
  const billsCount = data?.bills?.length || 0;
  const approvedBills = data?.bills?.filter(bill => bill.status === "APPROVED").length || 0;
  const pendingBills = data?.bills?.filter(bill => bill.status === "PENDING").length || 0;
  const rejectedBills = data?.bills?.filter(bill => bill.status === "REJECTED").length || 0;
  
  return {
    request: data,
    isLoading,
    error,
    refetch,
    cancelRequest: cancelRequestMutation.mutate,
    sendReminder: sendReminderMutation.mutate,
    // Summary data
    billsCount,
    approvedBills,
    pendingBills,
    rejectedBills,
    // Helper functions
    formatCurrency,
    formatDate,
  };
};
