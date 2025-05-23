import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Import components
import BundleHeader from "@/components/bundle/BundleHeader";
import StatCards from "@/components/bundle/StatCards";
import BundleItems from "@/components/bundle/BundleItems";
import BundleSummary from "@/components/bundle/BundleSummary";
import ActivityLog from "@/components/bundle/ActivityLog";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, X, Loader } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequest } from "@/hooks/useRequest";
import { Card, CardContent } from "@/components/ui/card";
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

const BeneficiaryBundleDetails = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    formatDate,
  } = useRequest(bundleId);

  useEffect(() => {
    // Set document title
    if (request) {
      document.title = `${request.name} | Request Details | Urgent2kay`;
    } else {
      document.title = "Request Details | Urgent2kay";
    }
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [request]);

  // Generate activity log data from request information
  const getActivityLogData = () => {
    if (!request) return [];

    const activities = [
      {
        type: "created",
        message: `Request "${request.name}" was created`,
        timestamp: request.createdAt,
        user: {
          name: request.requester?.name || "You",
        },
        completed: true, // Add the completed property
      },
    ];

    // Add activity entries based on bill status
    request.bills.forEach((bill) => {
      if (bill.status === "APPROVED") {
        activities.push({
          type: "approved",
          message: `Bill "${bill.billName}" was approved`,
          timestamp: request.createdAt, // Using request date since we don't have approval date
          user: {
            name: request.supporter?.name || "Supporter",
          },
          completed: true,
        });
      } else if (bill.status === "REJECTED") {
        activities.push({
          type: "rejected",
          message: `Bill "${bill.billName}" was rejected`,
          timestamp: request.createdAt, // Using request date since we don't have rejection date
          user: {
            name: request.supporter?.name || "Supporter",
          },
          completed: true,
        });
      } else {
        activities.push({
          type: "pending",
          message: `Bill "${bill.billName}" is awaiting approval`,
          timestamp: request.createdAt,
          user: {
            name: request.supporter?.name || "Supporter",
          },
          completed: false, // Add the completed property as false for pending items
        });
      }
    });

    // Sort activities by timestamp, newest first
    return activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  // Handle delete request
  const handleDeleteRequest = () => {
    if (!request) return;
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!request) return;
    deleteRequest();
  };

  // Handle send reminder
  const handleSendReminder = () => {
    if (!request) return;

    toast.loading("Sending reminder...");
    sendReminder();
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
            <Skeleton className="h-96 md:max-w-md" />
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
            onClick={() => navigate("/dashboard/beneficiary/requests")}
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
    name: bill.billName,
    amount: new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
    }).format(bill.amount),
    priority: bill.priority.toLowerCase() as "high" | "medium" | "low",
    category: bill.type,
    duedates: bill.dueDate,
  }));

  return (
    <div className="">
      {/* Bundle header and stats card wrapped in a Card component */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Bundle header with navigation and action buttons */}
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

      {/* Bundle items */}
      <BundleItems items={formattedBills} />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-6">
        <div className="md:col-span-4">
          {/* Bundle Summary */}
          <div>
            <BundleSummary
              description={request.notes}
              sponsor={{
                name: request.supporter?.name || "No sponsor assigned",
                email: request.supporter?.email,
              }}
              requester={{
                name: request.requester?.name || "No requester information",
                email: request.requester?.email,
              }}
              amount={
                request.formattedAmount ||
                new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  currencyDisplay: "symbol",
                  minimumFractionDigits: 0,
                }).format(request.totalAmount || 0)
              }
              createdAt={request.createdAt}
              dueDate={request.earliestDueDate}
              showRequester={true}
              showSponsor={true}
            />
          </div>
        </div>
        {/* Activity Log */}
        <div className="md:col-span-2">
          <ActivityLog activities={getActivityLogData()} />
        </div>
        {/* Beneficiary-specific action buttons */}
        {componentStatus === "pending" && (
          <div className="flex flex-col sm:flex-row gap-4 md:col-span-4">
            <Button
              onClick={handleSendReminder}
              className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
            >
              <Bell className="mr-2 h-4 w-4" />
              Send Reminder
            </Button>
            <Button
              onClick={handleDeleteRequest}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete Request"}
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              request "{request.name}" and removed from your lists of requests
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
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BeneficiaryBundleDetails;
