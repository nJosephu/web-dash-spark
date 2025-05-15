import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import RequestCard from "@/components/dashboard/RequestCard";
import { useSponsorRequests } from "@/hooks/useSponsorRequests";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/dashboard/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SponsorIncomingRequests = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch requests using our custom hook
  const {
    requests,
    isLoading,
    error,
    refetch,
    requestsCount,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
  } = useSponsorRequests();

  // Filter requests based on search query and status filter
  const filteredRequests = requests.filter((request) => {
    // Filter by search query
    if (
      searchQuery &&
      !request.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (statusFilter === "pending" && request.status !== "PENDING")
      return false;
    if (statusFilter === "approved" && request.status !== "APPROVED")
      return false;
    if (statusFilter === "rejected" && request.status !== "REJECTED")
      return false;
    if (
      statusFilter !== "all" &&
      statusFilter !== "pending" &&
      statusFilter !== "approved" &&
      statusFilter !== "rejected"
    )
      return true;

    return true;
  });

  // Loading UI
  if (isLoading) {
    return (
      <div>
        <div className="mb-6"></div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              className="pl-9 w-full sm:w-64"
              disabled
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-64" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div>
        <div className="mb-6"></div>

        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading requests</p>
          <p className="text-sm mt-1">
            {error instanceof Error
              ? error.message
              : "Failed to load requests. Please try again."}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-3 text-red-600 border-red-200 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-500">
          Manage and review incoming requests from beneficiaries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Requests"
          value={requestsCount.toString()}
          color="purple"
          colortag="white"
        />
        <StatCard
          title="Approved Requests"
          value={approvedRequests.toString()}
          color="green"
          colortag="black"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.toString()}
          color="yellow"
          colortag="black"
        />
        <StatCard
          title="Rejected Requests"
          value={rejectedRequests.toString()}
          color="red"
          colortag="white"
        />
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">Sent Requests</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                className="pl-9 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Requests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="p-0 overflow-hidden">
                <RequestCard
                  id={request.id}
                  displayId={`REQ-${request.id.substring(0, 3)}`}
                  title={request.name}
                  amount={request.totalAmount}
                  date={request.createdAt}
                  status={request.status}
                  requester={request.requester}
                  isBeneficiary={false}
                />
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No requests match your filters</p>
            {searchQuery || statusFilter !== "all" ? (
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-2"
              >
                Clear all filters
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorIncomingRequests;
