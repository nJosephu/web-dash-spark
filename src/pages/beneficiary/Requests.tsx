import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

import { useAuth } from "@/context/AuthContext";
import requestService, { Request, User } from "@/services/requestService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, Loader, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FormattedRequest extends Request {
  formattedId: string;
  totalAmount: number;
}

interface RequestCardProps {
  id: string;
  displayId: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  requester: User | Partial<User> | null; // Updated to accept partial User or null
  onCancel: (id: string) => void;
  onRemind: (id: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  displayId,
  title,
  amount,
  date,
  status,
  requester,
  onCancel,
  onRemind,
}) => {
  const navigate = useNavigate();

  // Format the date using date-fns
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Format the amount to NGN currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Determine the status color based on the status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get requester name with fallback
  const getRequesterName = () => {
    return requester?.name || "N/A";
  };

  return (
    <Card className="bg-white shadow-md rounded-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {displayId}
        </CardTitle>
        <Badge className={`${getStatusColor(status)} uppercase text-xs`}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <CardDescription className="text-base text-gray-800 font-semibold">
          {title}
        </CardDescription>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Amount: {formatCurrency(amount)}
        </CardDescription>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Date: {formatDate(date)}
        </CardDescription>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Requester: {getRequesterName()}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-4 py-3 bg-gray-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/dashboard/beneficiary/requests/${id}`)}
        >
          View Details
        </Button>
        <div className="flex gap-2">
          {status === "PENDING" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onCancel(id)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                onClick={() => onRemind(id)}
              >
                Remind
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

const Requests = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  // Function to format the request data
  const formatRequestData = (request: Request): FormattedRequest => {
    const totalAmount = request.bills.reduce(
      (sum, bill) => sum + bill.amount,
      0
    );

    return {
      ...request,
      formattedId: `REQ-${request.id.substring(0, 6)}`,
      totalAmount: totalAmount,
    };
  };

  // Fetch requests using React Query
  const {
    data: requests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      if (!user?.id || !token) {
        throw new Error("User ID or authentication token not found");
      }

      const response = await requestService.getUserRequests(user.id, token);

      if (!response.success || !response.data) {
        throw new Error(response.data
          ? "Failed to fetch requests"
          : "No requests found");
      }

      // Format the request data
      const formattedRequests = response.data.map((request) =>
        formatRequestData(request)
      );

      return formattedRequests;
    },
  });

  // Mutation for cancelling a request
  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      if (!token) throw new Error("Authentication required");
      return await requestService.cancelRequest(requestId, token);
    },
    onSuccess: () => {
      toast.success("Request cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel request: ${error.message}`);
    },
  });

  // Mutation for sending a reminder
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

  // Function to handle request cancellation
  const handleCancelRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsCancelDialogOpen(true);
  };

  // Function to handle sending a reminder
  const handleSendReminder = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsReminderDialogOpen(true);
  };

  // Function to confirm request cancellation
  const handleConfirmCancel = () => {
    if (selectedRequestId) {
      cancelRequestMutation.mutate(selectedRequestId);
      setIsCancelDialogOpen(false);
    }
  };

  // Function to confirm sending a reminder
  const handleConfirmReminder = () => {
    if (selectedRequestId) {
      sendReminderMutation.mutate(selectedRequestId);
      setIsReminderDialogOpen(false);
    }
  };

  // Function to filter requests based on the selected tab
  const filterRequests = (
    requests: FormattedRequest[] | undefined,
    tab: string
  ): FormattedRequest[] => {
    if (!requests) return [];
    switch (tab) {
      case "pending":
        return requests.filter((request) => request.status === "PENDING");
      case "approved":
        return requests.filter((request) => request.status === "APPROVED");
      case "rejected":
        return requests.filter((request) => request.status === "REJECTED");
      default:
        return requests;
    }
  };

  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  // Filter requests based on the selected tab
  const filteredRequests = filterRequests(requests, selectedTab);

  // Render empty state
  const renderEmptyState = (tab: string) => (
    <div className="flex flex-col items-center justify-center py-12">
      {tab === "pending" && (
        <>
          <XCircle className="h-10 w-10 text-yellow-500 mb-2" />
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            No Pending Requests
          </h2>
          <p className="text-gray-500">
            You don't have any pending payment requests.
          </p>
        </>
      )}
      {tab === "approved" && (
        <>
          <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            No Approved Requests
          </h2>
          <p className="text-gray-500">
            You don't have any approved payment requests.
          </p>
        </>
      )}
      {tab === "rejected" && (
        <>
          <XCircle className="h-10 w-10 text-red-500 mb-2" />
          <h2 className="text-xl font-semibold text-gray-700 mb-1">
            No Rejected Requests
          </h2>
          <p className="text-gray-500">
            You don't have any rejected payment requests.
          </p>
        </>
      )}
    </div>
  );

  // Render loading state
  const renderLoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-white shadow-md rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Badge>
              <Skeleton className="h-4 w-12" />
            </Badge>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <CardDescription className="text-base text-gray-800 font-semibold">
              <Skeleton className="h-5 w-48" />
            </CardDescription>
            <CardDescription className="text-sm text-gray-500 mt-1">
              <Skeleton className="h-4 w-32" />
            </CardDescription>
            <CardDescription className="text-sm text-gray-500 mt-1">
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between items-center px-4 py-3 bg-gray-50">
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <XCircle className="h-10 w-10 text-red-500 mb-2" />
      <h2 className="text-xl font-semibold text-gray-700 mb-1">
        Failed to Load Requests
      </h2>
      <p className="text-gray-500">
        An error occurred while fetching your payment requests.
      </p>
      <Button onClick={() => queryClient.refetchQueries({ queryKey: ["requests"] })} className="mt-4">
        Retry
      </Button>
    </div>
  );

  return (
    <div className="container px-4 md:px-6 space-y-6 pb-20">
      <div className="flex items-center justify-between h-16">
        <h1 className="text-2xl font-semibold">Payment Requests</h1>
      </div>
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {/* Requests list */}
          {isLoading ? (
            renderLoadingState()
          ) : error ? (
            renderErrorState()
          ) : filteredRequests.length === 0 ? (
            renderEmptyState(selectedTab)
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  displayId={request.formattedId || `REQ-${request.id.substring(0, 6)}`}
                  title={request.name}
                  amount={request.totalAmount || 0}
                  date={request.createdAt}
                  status={request.status}
                  requester={request.requester || { name: "N/A" }}
                  onCancel={handleCancelRequest}
                  onRemind={handleSendReminder}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="approved">
          {/* Requests list */}
          {isLoading ? (
            renderLoadingState()
          ) : error ? (
            renderErrorState()
          ) : filteredRequests.length === 0 ? (
            renderEmptyState(selectedTab)
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  displayId={request.formattedId || `REQ-${request.id.substring(0, 6)}`}
                  title={request.name}
                  amount={request.totalAmount || 0}
                  date={request.createdAt}
                  status={request.status}
                  requester={request.requester || { name: "N/A" }}
                  onCancel={handleCancelRequest}
                  onRemind={handleSendReminder}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="rejected">
          {/* Requests list */}
          {isLoading ? (
            renderLoadingState()
          ) : error ? (
            renderErrorState()
          ) : filteredRequests.length === 0 ? (
            renderEmptyState(selectedTab)
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  displayId={request.formattedId || `REQ-${request.id.substring(0, 6)}`}
                  title={request.name}
                  amount={request.totalAmount || 0}
                  date={request.createdAt}
                  status={request.status}
                  requester={request.requester || { name: "N/A" }}
                  onCancel={handleCancelRequest}
                  onRemind={handleSendReminder}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reminder Confirmation Dialog */}
      <AlertDialog
        open={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send a reminder for this request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsReminderDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReminder}>
              Send Reminder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Requests;
