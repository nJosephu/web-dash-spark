
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import RequestCard from "@/components/dashboard/RequestCard";

// Define the types for status and priority to match RequestCard props
type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";
type RequestPriority = "high" | "medium" | "low";

// Mock data to demonstrate functionality
const mockRequests = [
  {
    id: "REQ-001",
    title: "Electricity bill payment",
    amount: "₦15,000",
    date: "May 3, 2025",
    status: "pending" as RequestStatus,
    sponsor: { name: "N/A" },
    priority: "high" as RequestPriority,
  },
  {
    id: "REQ-002",
    title: "Water bill payment",
    amount: "₦8,500",
    date: "May 2, 2025",
    status: "approved" as RequestStatus,
    sponsor: { name: "John Doe" },
    priority: "medium" as RequestPriority,
  },
  {
    id: "REQ-003",
    title: "Internet bill payment",
    amount: "₦12,000",
    date: "May 1, 2025",
    status: "pending" as RequestStatus,
    sponsor: { name: "N/A" },
    priority: "low" as RequestPriority,
  },
  {
    id: "REQ-004",
    title: "School fees payment",
    amount: "₦45,000",
    date: "April 30, 2025",
    status: "rejected" as RequestStatus,
    sponsor: { name: "N/A" },
    priority: "high" as RequestPriority,
  },
  {
    id: "REQ-005",
    title: "Medical bill payment",
    amount: "₦22,500",
    date: "April 29, 2025",
    status: "approved" as RequestStatus,
    sponsor: { name: "Sarah Johnson" },
    priority: "high" as RequestPriority,
  },
];

const SponsorIncomingRequests = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<RequestPriority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  // Filter requests based on search query, tab, priority, and status
  const filteredRequests = mockRequests.filter((request) => {
    // Filter by search query
    if (
      searchQuery &&
      !request.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by tab
    if (activeTab === "pending" && request.status !== "pending") return false;
    if (activeTab === "approved" && request.status !== "approved") return false;
    if (activeTab === "rejected" && request.status !== "rejected") return false;

    // Filter by priority
    if (priorityFilter !== "all" && request.priority !== priorityFilter) return false;

    // Filter by status
    if (statusFilter !== "all" && request.status !== statusFilter) return false;

    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Funding Requests</h1>
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
          <Select 
            value={priorityFilter} 
            onValueChange={(value) => setPriorityFilter(value as RequestPriority | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High priority</SelectItem>
              <SelectItem value="medium">Medium priority</SelectItem>
              <SelectItem value="low">Low priority</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setSearchQuery("");
              setPriorityFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4 mt-0">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <RequestCard
                  id={request.id}
                  title={request.title}
                  amount={request.amount}
                  date={request.date}
                  status={request.status}
                  sponsor={request.sponsor}
                  priority={request.priority}
                />
              </Card>
            ))
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500">No requests match your filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-0">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <RequestCard
                  id={request.id}
                  title={request.title}
                  amount={request.amount}
                  date={request.date}
                  status={request.status}
                  sponsor={request.sponsor}
                  priority={request.priority}
                />
              </Card>
            ))
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500">No pending requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-0">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <RequestCard
                  id={request.id}
                  title={request.title}
                  amount={request.amount}
                  date={request.date}
                  status={request.status}
                  sponsor={request.sponsor}
                  priority={request.priority}
                />
              </Card>
            ))
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500">No approved requests</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-0">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <RequestCard
                  id={request.id}
                  title={request.title}
                  amount={request.amount}
                  date={request.date}
                  status={request.status}
                  sponsor={request.sponsor}
                  priority={request.priority}
                />
              </Card>
            ))
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500">No rejected requests</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorIncomingRequests;
