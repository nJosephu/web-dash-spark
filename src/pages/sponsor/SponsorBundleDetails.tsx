
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Import components
import BundleHeader from "@/components/bundle/BundleHeader";
import StatCards from "@/components/bundle/StatCards";
import BundleItems from "@/components/bundle/BundleItems";
import BundleSummary from "@/components/bundle/BundleSummary";
import ActivityLog from "@/components/bundle/ActivityLog";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, X, Loader } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { useRequest } from "@/hooks/useRequest";
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

const SponsorBundleDetails = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use our custom hook to fetch request data
  const {
    request,
    isLoading,
    error,
    cancelRequest,
    deleteRequest,
    isDeleting,
    sendReminder,
    billsCount,
    approvedBills,
    pendingBills,
    rejectedBills,
    formatCurrency,
  } = useRequest(bundleId);

  // Format the date using date-fns
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Handle approve/reject actions
  const handleApproveRequest = () => {
    if (!request) return;
    
    setIsProcessing(true);
    
    // Simulate API call with timeout (replace with actual API call)
    setTimeout(() => {
      toast.success("Request approved successfully");
      setIsProcessing(false);
      // After successful operation, navigate back to requests list
      navigate("/dashboard/sponsor/requests");
    }, 1000);
  };

  // Handle cancel request
  const handleCancelRequest = () => {
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!bundleId) return;
    deleteRequest();
    // After successful operation, navigate back to requests list
    navigate("/dashboard/sponsor/requests");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32 mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>

            <Skeleton className="h-64" />
            <Skeleton className="h-48" />

            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>

          <div className="md:col-span-4">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <p className="text-gray-500 mb-8">
          {error instanceof Error
            ? error.message
            : "Failed to load request details"}
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/dashboard/sponsor/requests")}
            variant="outline"
          >
            Back to Requests
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#6544E4] hover:bg-[#5A3DD0]"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Convert status from API (PENDING, APPROVED, REJECTED) to component format (pending, approved, rejected)
  const statusMapping: Record<string, "pending" | "approved" | "rejected"> = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  };

  const componentStatus = statusMapping[request.status] || "pending";

  // Format the bills array for the BundleItems component
  const formattedBills = request.bills.map((bill) => ({
    id: bill.id,
    name: bill.billName,
    amount: formatCurrency(bill.amount),
    priority: bill.priority.toLowerCase() as "high" | "medium" | "low",
    category: bill.type || bill.provider?.name || "Bill",
    duedates: bill.dueDate,
  }));

  return (
    <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
      {/* Bundle header with navigation and action buttons */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <BundleHeader
            id={request.formattedId || `REQ-${request.id.substring(0, 6)}`}
            title={request.name}
            date={request.createdAt}
            status={componentStatus}
          />

          {/* Stats cards */}
          <div className="mt-6">
            <StatCards
              billsCount={billsCount}
              approvedBills={approvedBills}
              pendingBills={pendingBills}
              rejectedBills={rejectedBills}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bundle content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left section - Bundle information */}
        <div className="md:col-span-2 space-y-6">
          {/* Bundle items */}
          <BundleItems items={formattedBills} showDeleteButton={componentStatus === "pending"} />

          {/* Bundle summary */}
          <BundleSummary
            description={request.notes}
            sponsor={{
              name: request.supporter?.name || "No sponsor assigned",
              email: request.supporter?.email,
            }}
            amount={request.formattedAmount}
            createdAt={request.createdAt}
            dueDate={request.earliestDueDate}
          />

          {/* Sponsor-specific action buttons */}
          {componentStatus === "pending" && (
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={handleCancelRequest}
                disabled={isProcessing}
                variant="outline" 
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Request
              </Button>
              <Button 
                onClick={handleApproveRequest}
                disabled={isProcessing}
                className="flex-1 bg-[#6544E4] hover:bg-[#5A3DD0]"
              >
                {isProcessing ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? "Processing..." : "Approve Request"}
              </Button>
            </div>
          )}
        </div>

        {/* Right section - Activity log */}
        <div>
          <ActivityLog activities={request.activityLog || []} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SponsorBundleDetails;
