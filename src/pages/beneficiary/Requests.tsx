
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import CreateBundleSheet from "@/components/dashboard/CreateBundleSheet";
import RequestCard from "@/components/dashboard/RequestCard";

// Define request type
interface Request {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  sponsor: string;
  priority?: "high" | "medium" | "low";
  description?: string;
  items?: { name: string; amount: string }[];
}

const BeneficiaryRequests = () => {
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    document.title = "My Requests | Urgent2kay";

    // Get user data from sessionStorage instead of localStorage
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (userData.email) {
      // Extract name from email (for demo purposes)
      const nameFromEmail = userData.email.split("@")[0];
      setUserName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }
  }, []);

  const requestsData: Request[] = [
    {
      id: "REQ-001",
      title: "Rent Payment",
      amount: "₦120,000",
      date: "2025-04-25",
      status: "approved",
      sponsor: "John Doe",
      priority: "high",
      description: "Monthly rent payment for apartment",
      items: [{ name: "Rent", amount: "₦120,000" }],
    },
    {
      id: "REQ-002",
      title: "Electricity Bill",
      amount: "₦45,000",
      date: "2025-04-22",
      status: "pending",
      sponsor: "--",
      priority: "medium",
      description: "Monthly electricity bill payment",
      items: [{ name: "Electricity", amount: "₦45,000" }],
    },
    {
      id: "REQ-003",
      title: "Water Bill",
      amount: "₦15,000",
      date: "2025-04-18",
      status: "rejected",
      sponsor: "Jane Smith",
      priority: "low",
      description: "Monthly water bill payment",
      items: [{ name: "Water", amount: "₦15,000" }],
    },
    {
      id: "REQ-004",
      title: "Internet Payment",
      amount: "₦25,000",
      date: "2025-04-15",
      status: "approved",
      sponsor: "Mike Johnson",
      priority: "medium",
      description: "Monthly internet subscription",
      items: [{ name: "Internet", amount: "₦25,000" }],
    },
    {
      id: "REQ-005",
      title: "School Fees",
      amount: "₦180,000",
      date: "2025-04-10",
      status: "pending",
      sponsor: "--",
      priority: "high",
      description: "Semester school fees payment",
      items: [
        { name: "Tuition", amount: "₦150,000" },
        { name: "Books", amount: "₦30,000" },
      ],
    },
  ];

  // Filter and search functionality
  const filteredRequests = requestsData.filter((request) => {
    // Apply status filter if selected
    if (statusFilter && request.status !== statusFilter) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.title.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query) ||
        request.sponsor.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleCreateRequest = () => {
    // We're using the existing CreateBundleSheet component which has toast functionality built in
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-between items-center mb-6">
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
                <div className="text-2xl font-bold">{requestsData.length}</div>
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
                  {
                    requestsData.filter((req) => req.status === "approved")
                      .length
                  }
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
                  {
                    requestsData.filter((req) => req.status === "pending")
                      .length
                  }
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
                  {
                    requestsData.filter((req) => req.status === "rejected")
                      .length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-4 overflow-hidden">
            <CardHeader className="bg-white flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg font-medium">
                Sent Requests
              </CardTitle>
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
                <div className="relative">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-sm"
                    onClick={() =>
                      setStatusFilter(statusFilter === null ? "pending" : null)
                    }
                  >
                    <Filter size={16} />
                    {statusFilter ? `Filter: ${statusFilter}` : "Filter"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    id={request.id}
                    title={request.title}
                    amount={request.amount}
                    date={request.date}
                    status={request.status}
                    sponsor={{
                      name:
                        request.sponsor !== "--"
                          ? request.sponsor
                          : "No sponsor",
                    }}
                    priority={request.priority}
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
      </div>
    </div>
  );
};

export default Requests;
