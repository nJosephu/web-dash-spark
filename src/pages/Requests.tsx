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
import { FileText, Plus } from "lucide-react";

const Requests = () => {
  const [userName, setUserName] = useState("User");

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

  const requestsData = [
    {
      id: "REQ-001",
      title: "Rent Payment",
      amount: "₦120,000",
      date: "2025-04-25",
      status: "approved",
      sponsor: "John Doe",
    },
    {
      id: "REQ-002",
      title: "Electricity Bill",
      amount: "₦45,000",
      date: "2025-04-22",
      status: "pending",
      sponsor: "--",
    },
    {
      id: "REQ-003",
      title: "Water Bill",
      amount: "₦15,000",
      date: "2025-04-18",
      status: "rejected",
      sponsor: "Jane Smith",
    },
    {
      id: "REQ-004",
      title: "Internet Payment",
      amount: "₦25,000",
      date: "2025-04-15",
      status: "approved",
      sponsor: "Mike Johnson",
    },
    {
      id: "REQ-005",
      title: "School Fees",
      amount: "₦180,000",
      date: "2025-04-10",
      status: "pending",
      sponsor: "--",
    },
  ];

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
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
              <Plus className="mr-2 h-4 w-4" /> Create Request
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Approved Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">2</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">2</div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-white">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-[#6544E4]" /> Recent
                Requests
              </CardTitle>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestsData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.id}
                        </TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.amount}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>{request.sponsor}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(request.status)}`}
                            variant="outline"
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Requests;
