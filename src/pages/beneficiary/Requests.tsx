import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import RequestCard from "@/components/dashboard/RequestCard";
import { useRequests } from "@/hooks/useRequests";
import StatCard from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import CreateBundleSheet from "@/components/dashboard/CreateBundleSheet";

const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Use our custom hook to get requests data and operations
  const {
    requests,
    isLoading,
    error,
    refetch,
    requestsCount,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
  } = useRequests();

  // Filter requests based on search query and status filter
  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch =
      !searchQuery.trim() ||
      request.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      request.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Rendering the loading state
  if (isLoading) {
    return (
      <div className="container p-0">
        <div className="flex justify-between items-center mb-6"></div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>

        {/* Sent Requests */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Rendering the error state
  if (error) {
    return (
      <div className="container p-0">
        <div className="flex justify-between items-center mb-6"></div>

        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-medium">Error loading requests</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : "Failed to load requests"}
          </p>
          <Button onClick={() => refetch()} className="mt-3" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <p className="text-gray-500">
            Manage and track all your bill requests
          </p>
        </div>
        <CreateBundleSheet
          trigger={
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
              <Plus className="mr-2" size={16} />
              Create Request
            </Button>
          }
        />
      </div>

      {/* Stats Cards - Updated for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white rounded-lg p-4">
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

      {/* Sent Requests */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h2 className="text-lg font-medium">Sent Requests</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search requests..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
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
                  amount={request.totalAmount || 0}
                  date={request.createdAt}
                  status={request.status}
                  requester={request.requester}
                  supporter={request.supporter}
                  isBeneficiary={true}
                />
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
