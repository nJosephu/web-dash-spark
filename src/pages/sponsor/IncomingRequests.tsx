
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import RequestCard from "@/components/dashboard/RequestCard";
import { useSponsorRequests } from "@/hooks/useSponsorRequests";
import { Request } from "@/services/requestService";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

// Define request status type for type safety
type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

const SponsorIncomingRequests = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch requests using our custom hook
  const { requests, isLoading, error, refetch } = useSponsorRequests();

  // Filter requests based on search query and tab
  const filteredRequests = requests.filter((request) => {
    // Filter by search query
    if (
      searchQuery &&
      !request.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by tab
    if (activeTab === "pending" && request.status !== "PENDING") return false;
    if (activeTab === "approved" && request.status !== "APPROVED") return false;
    if (activeTab === "rejected" && request.status !== "REJECTED") return false;

    return true;
  });

  // Loading UI
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Fund Requests</h1>
          <p className="text-gray-500">
            Manage and review incoming requests from beneficiaries
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

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
                <div className="p-4 border-b border-gray-100">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-4" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-9 w-full mt-4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Fund Requests</h1>
          <p className="text-gray-500">
            Manage and review incoming requests from beneficiaries
          </p>
        </div>

        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          <p className="font-medium">Error loading requests</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : "Failed to load requests. Please try again."}
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
        <h1 className="text-2xl font-medium">Fund Requests</h1>
        <p className="text-gray-500">
          Manage and review incoming requests from beneficiaries
        </p>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              className="pl-9 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
            }}
          >
            Clear filters
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-0 overflow-hidden">
                  <RequestCard
                    id={request.id}
                    displayId={request.displayId}
                    title={request.name}
                    amount={request.totalAmount}
                    date={request.createdAt}
                    status={request.status}
                    requester={request.requester}
                    priority={request.bills[0]?.priority || "MEDIUM"}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No requests match your filters</p>
              {searchQuery || activeTab !== "all" ? (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                  className="mt-2"
                >
                  Clear all filters
                </Button>
              ) : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-0 overflow-hidden">
                  <RequestCard
                    id={request.id}
                    displayId={request.displayId}
                    title={request.name}
                    amount={request.totalAmount}
                    date={request.createdAt}
                    status={request.status}
                    requester={request.requester}
                    priority={request.bills[0]?.priority || "MEDIUM"}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No pending requests found</p>
              {searchQuery ? (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              ) : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-0 overflow-hidden">
                  <RequestCard
                    id={request.id}
                    displayId={request.displayId}
                    title={request.name}
                    amount={request.totalAmount}
                    date={request.createdAt}
                    status={request.status}
                    requester={request.requester}
                    priority={request.bills[0]?.priority || "MEDIUM"}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No approved requests found</p>
              {searchQuery ? (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              ) : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          {filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-0 overflow-hidden">
                  <RequestCard
                    id={request.id}
                    displayId={request.displayId}
                    title={request.name}
                    amount={request.totalAmount}
                    date={request.createdAt}
                    status={request.status}
                    requester={request.requester}
                    priority={request.bills[0]?.priority || "MEDIUM"}
                  />
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No rejected requests found</p>
              {searchQuery ? (
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              ) : null}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorIncomingRequests;
