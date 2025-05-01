
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Filter, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import CreateBundleSheet from "@/components/dashboard/CreateBundleSheet";

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

const Requests = () => {
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    document.title = "My Requests | Urgent2kay";

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
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
      items: [
        { name: "Rent", amount: "₦120,000" }
      ]
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
      items: [
        { name: "Electricity", amount: "₦45,000" }
      ]
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
      items: [
        { name: "Water", amount: "₦15,000" }
      ]
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
      items: [
        { name: "Internet", amount: "₦25,000" }
      ]
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
        { name: "Books", amount: "₦30,000" }
      ]
    },
  ];

  // Filter and search functionality
  const filteredRequests = requestsData.filter(request => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleCreateRequest = () => {
    // We're using the existing CreateBundleSheet component which has toast functionality built in
  };

  const handleApproveRequest = (id: string) => {
    toast.success(`Request ${id} approved`);
    setIsDialogOpen(false);
  };

  const handleRejectRequest = (id: string) => {
    toast.error(`Request ${id} rejected`);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="mmax-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Requests</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  {requestsData.filter(req => req.status === "approved").length}
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
                  {requestsData.filter(req => req.status === "pending").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-white flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-[#6544E4]" /> Recent Requests
              </CardTitle>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#6544E4] focus:border-[#6544E4]"
                  />
                </div>

                {/* Filter dropdown */}
                <div className="relative">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setStatusFilter(statusFilter === null ? "pending" : null)}
                  >
                    <Filter size={16} />
                    {statusFilter ? `Filter: ${statusFilter}` : "Filter"}
                  </Button>
                  {/* We could add a dropdown menu here for more filter options */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.id}
                          </TableCell>
                          <TableCell>{request.title}</TableCell>
                          <TableCell>{request.amount}</TableCell>
                          <TableCell>{request.date}</TableCell>
                          <TableCell>{request.sponsor}</TableCell>
                          <TableCell>
                            {request.priority && (
                              <Badge
                                className={`${getPriorityColor(request.priority)}`}
                                variant="outline"
                              >
                                {request.priority}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(request.status)}`}
                              variant="outline"
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewRequest(request)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No requests found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* Request Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRequest.title}</h3>
                  <p className="text-sm text-gray-500">{selectedRequest.id}</p>
                </div>
                <Badge
                  className={`${getStatusColor(selectedRequest.status)}`}
                  variant="outline"
                >
                  {selectedRequest.status}
                </Badge>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{selectedRequest.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="font-semibold">{selectedRequest.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sponsor</p>
                  <p>{selectedRequest.sponsor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p>
                    {selectedRequest.priority && (
                      <Badge
                        className={`${getPriorityColor(selectedRequest.priority)}`}
                        variant="outline"
                      >
                        {selectedRequest.priority}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedRequest.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p>{selectedRequest.description}</p>
                </div>
              )}

              {/* Items */}
              {selectedRequest.items && selectedRequest.items.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                  <div className="bg-gray-50 rounded-md p-3">
                    {selectedRequest.items.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between py-2 border-b last:border-0 border-gray-200"
                      >
                        <span>{item.name}</span>
                        <span className="font-medium">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                    >
                      Approve
                    </Button>
                  </>
                )}
                {selectedRequest.status !== "pending" && (
                  <Button 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Requests;
