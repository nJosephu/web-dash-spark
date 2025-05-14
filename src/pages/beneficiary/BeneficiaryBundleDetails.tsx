
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Import components
import BundleHeader from "@/components/bundle/BundleHeader";
import StatCards from "@/components/bundle/StatCards";
import BundleItems from "@/components/bundle/BundleItems";
import BundleSummary from "@/components/bundle/BundleSummary";
import ActivityLog from "@/components/bundle/ActivityLog";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequest } from "@/hooks/useRequest";

const BeneficiaryBundleDetails = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use our custom hook to fetch request data
  const {
    request,
    isLoading,
    error,
    cancelRequest,
    sendReminder,
    billsCount,
    approvedBills,
    pendingBills,
    rejectedBills
  } = useRequest(bundleId);

  useEffect(() => {
    // Set document title
    if (request) {
      document.title = `${request.name} | Request Details | Urgent2kay`;
    } else {
      document.title = "Request Details | Urgent2kay";
    }
  }, [request]);

  // Handle cancel request
  const handleCancelRequest = () => {
    if (!request) return;
    
    toast.loading("Cancelling request...");
    cancelRequest();
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
      <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
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
          {error instanceof Error ? error.message : "Failed to load request details"}
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
    "PENDING": "pending",
    "APPROVED": "approved",
    "REJECTED": "rejected"
  };
  
  const componentStatus = statusMapping[request.status] || "pending";
  
  // Format the bills array for the BundleItems component
  const formattedBills = request.bills.map(bill => ({
    name: bill.billName,
    amount: new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 0,
    }).format(bill.amount),
    priority: bill.priority.toLowerCase() as "high" | "medium" | "low",
    category: bill.type
  }));

  return (
    <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/beneficiary/requests">Bundle Details</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/beneficiary/requests">Back to Requests</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Bundle header with navigation and action buttons */}
      <BundleHeader
        id={request.formattedId || `UZK-${request.id.substring(0, 6)}`}
        title={request.name}
        date={request.createdAt}
        status={componentStatus}
      />

      {/* Bundle content */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Left section - Bundle information */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats cards */}
          <StatCards
            billsCount={billsCount}
            approvedBills={approvedBills}
            pendingBills={pendingBills}
            rejectedBills={rejectedBills}
            dueDate={request.earliestDueDate}
            priority={request.bills[0]?.priority.toLowerCase() as "high" | "medium" | "low"}
          />

          {/* Bundle items */}
          <BundleItems items={formattedBills} />

          {/* Bundle summary */}
          <BundleSummary
            description={request.notes}
            sponsor={{
              name: request.supporter?.name || "No sponsor assigned",
              email: request.supporter?.email
            }}
            amount={request.formattedAmount || new Intl.NumberFormat('en-NG', {
              style: 'currency',
              currency: 'NGN',
              currencyDisplay: 'symbol',
              minimumFractionDigits: 0,
            }).format(request.totalAmount || 0)}
            createdAt={request.createdAt}
            dueDate={request.earliestDueDate}
          />

          {/* Beneficiary-specific action buttons */}
          {componentStatus === "pending" && (
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleCancelRequest}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Request
              </Button>
              <Button
                onClick={handleSendReminder}
                className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
            </div>
          )}
        </div>

        {/* Right section - Activity log */}
        <div className="md:col-span-4">
          <ActivityLog activities={request.activityLog || []} />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryBundleDetails;
