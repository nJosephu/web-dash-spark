
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "@/components/layout/TopNav";
import { useRequest } from "@/hooks/useRequest";
import { useBillOperations } from "@/hooks/useBillOperations";
import { useAuth } from "@/context/AuthContext";
import { format, parseISO } from "date-fns";

// Import components
import BundleHeader from "@/components/bundle/BundleHeader";
import StatCards from "@/components/bundle/StatCards";
import BundleItems from "@/components/bundle/BundleItems";
import BundleSummary from "@/components/bundle/BundleSummary";
import ActivityLog from "@/components/bundle/ActivityLog";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";

const SponsorBundleDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State variables for confirmations
  const [isDeleteRequestDialogOpen, setIsDeleteRequestDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<string | null>(null);

  // Fetch request data
  const {
    request,
    isLoading,
    error,
    formatCurrency,
    formatDate,
    cancelRequest,
    isDeleting: isDeletingRequest
  } = useRequest(requestId);

  // Bill operations
  const { deleteBill, isDeletingBill } = useBillOperations(requestId || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6544E4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-4">Failed to load request details. Please try again.</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/dashboard/sponsor/requests")}>
              Back to Requests
            </Button>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Handle approve request
  const handleApproveRequest = () => {
    toast.success("This feature is coming soon!");
    // Placeholder for the approve request API call
  };

  // Handle bill deletion
  const handleDeleteBill = (billId: string) => {
    setBillToDelete(billId);
  };

  const confirmDeleteBill = () => {
    if (billToDelete) {
      deleteBill(billToDelete);
      setBillToDelete(null);
    }
  };

  // Handle request cancellation
  const handleCancelRequest = () => {
    setIsDeleteRequestDialogOpen(true);
  };

  const confirmCancelRequest = () => {
    if (requestId) {
      cancelRequest();
      setIsDeleteRequestDialogOpen(false);
      // Navigation is handled in the useRequest hook on success
    }
  };

  // Format data for BundleItems component
  const bundleItems = request.bills.map((bill) => ({
    id: bill.id,
    name: bill.billName,
    amount: formatCurrency(bill.amount),
    priority: bill.priority.toLowerCase() as "high" | "medium" | "low",
    category: bill.type || (bill.provider?.name || "General"),
    duedates: bill.dueDate,
  }));

  // Format data for BundleSummary component
  const sponsor = {
    name: request.supporter?.name || "No Sponsor",
    email: request.supporter?.email,
    avatar: "",
  };

  // Get earliest due date from bills
  const earliestDueDate = request.bills.length > 0 
    ? request.bills.reduce((earliest, bill) => {
        if (!earliest) return bill.dueDate;
        return new Date(bill.dueDate) < new Date(earliest) ? bill.dueDate : earliest;
      }, null)
    : null;

  return (
    <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
      {/* Bundle header with navigation and action buttons */}
      <BundleHeader
        id={`REQ-${requestId?.substring(0, 3) || ""}`}
        title={request.name}
        date={request.createdAt}
        status={request.formattedStatus}
      />

      {/* Bundle content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left section - Bundle information */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats cards */}
          <StatCards
            amount={request.formattedAmount}
            date={earliestDueDate ? formatDate(earliestDueDate) : "N/A"}
            priority={request.bills.length > 0 ? request.bills[0].priority.toLowerCase() as "high" | "medium" | "low" : "medium"}
          />

          {/* Bundle items with delete buttons */}
          <Card className="border">
            <div className="p-4 border-b">
              <h3 className="font-medium">Bundle Items</h3>
            </div>
            <div className="p-4">
              {request.bills.length === 0 ? (
                <p className="text-gray-500 text-center p-4">No bills associated with this request.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {request.bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{bill.billName}</span>
                        <span className="text-xs text-gray-500">{bill.type || (bill.provider?.name || "General")}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            bill.priority === "HIGH" ? "bg-red-100 text-red-800" : 
                            bill.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : 
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {bill.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            Due: {formatDate(bill.dueDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(bill.amount)}</span>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteBill(bill.id)}
                          disabled={isDeletingBill}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Bundle summary */}
          <BundleSummary
            description={request.notes || "No description provided."}
            sponsor={sponsor}
            amount={request.formattedAmount}
            createdAt={request.createdAt}
            dueDate={earliestDueDate}
          />

          {/* Sponsor-specific action buttons */}
          {request.formattedStatus === "pending" && (
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={handleCancelRequest}
                disabled={isDeletingRequest}
                variant="outline" 
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Request
              </Button>
              <Button 
                onClick={handleApproveRequest}
                className="flex-1 bg-[#6544E4] hover:bg-[#5A3DD0]"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Request
              </Button>
            </div>
          )}
        </div>

        {/* Right section - Activity log */}
        <div>
          <ActivityLog activities={request.activityLog} />
        </div>
      </div>

      {/* Delete Bill Confirmation Dialog */}
      <AlertDialog open={billToDelete !== null} onOpenChange={() => setBillToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBill} className="bg-red-600 text-white hover:bg-red-700">
              {isDeletingBill ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Deleting...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Request Confirmation Dialog */}
      <AlertDialog open={isDeleteRequestDialogOpen} onOpenChange={setIsDeleteRequestDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelRequest} className="bg-red-600 text-white hover:bg-red-700">
              {isDeletingRequest ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Cancelling...
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
