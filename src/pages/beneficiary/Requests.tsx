import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import CreateBundleSheet from "@/components/dashboard/CreateBundleSheet";
import RequestCard from "@/components/dashboard/RequestCard";
import RequestCardSkeleton from "@/components/dashboard/RequestCardSkeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequests } from "@/hooks/useRequests";

const BeneficiaryRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const {
    requests,
    isLoading,
    error,
    requestsCount,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
    cancelRequest,
    sendReminder,
  } = useRequests();

  // Filter and search functionality
  const filteredRequests = requests.filter((request) => {
    // Apply status filter if selected
    if (
      statusFilter &&
      statusFilter !== "all" &&
      request.status !== statusFilter
    ) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.name.toLowerCase().includes(query) ||
        request.displayId.toLowerCase().includes(query) ||
        (request.supporter?.name || "").toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleCancelRequest = (requestId: string) => {
    cancelRequest(requestId);
  };

  const handleSendReminder = (requestId: string) => {
    sendReminder(requestId);
  };

  const handleCreateRequest = () => {
    // We're using the existing CreateBundleSheet component which has toast functionality built in
  };

  // Create array of skeletons for loading state
  const skeletons = Array(6)
    .fill(0)
    .map((_, index) => <RequestCardSkeleton key={`skeleton-${index}`} />);

  return (
    <div className="">
      <div
        className="flex flex-col sm:flex-row justify-between items-center gap-5 mb-6
"
      >
        <div>
          <p className="text-gray-500">
            Manage and track all your bill requests
          </p>
        </div>
        <CreateBundleSheet
          trigger={
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
              <Plus className="mr-2 h-4 w-4" /> Create Request
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Approved Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedRequests}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingRequests}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Rejected Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rejectedRequests}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4 overflow-hidden">
        <CardHeader className="bg-white flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-medium">Sent Requests</CardTitle>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
            {/* Search input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#6544E4] focus:border-[#6544E4] text-sm"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative w-44">
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {skeletons}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-red-500 mb-4">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#6544E4] hover:bg-[#5A3DD0]"
            >
              Retry
            </Button>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                id={request.id}
                displayId={request.displayId}
                title={request.name}
                amount={request.totalAmount}
                date={request.createdAt}
                status={request.status}
                sponsor={{
                  name: request.supporter?.name || "No sponsor",
                }}
                onCancel={handleCancelRequest}
                onRemind={handleSendReminder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">
              No requests found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BeneficiaryRequests;
