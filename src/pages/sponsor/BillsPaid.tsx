
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Payment {
  id: string;
  description: string;
  beneficiary: {
    name: string;
    email: string;
  };
  date: string;
  amount: string;
  status: "completed" | "processing" | "failed";
  reference: string;
}

const BillsPaid = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    document.title = "Bills Paid | Urgent2kay";
  }, []);

  // Mock data for payment history
  const paymentsData: Payment[] = [
    {
      id: "1",
      description: "Rent Payment",
      beneficiary: {
        name: "James Wilson",
        email: "james.wilson@example.com",
      },
      date: "April 25, 2025",
      amount: "₦120,000",
      status: "completed",
      reference: "REF-2025-04-25-001",
    },
    {
      id: "2",
      description: "Electricity Bill",
      beneficiary: {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
      },
      date: "April 20, 2025",
      amount: "₦45,000",
      status: "completed",
      reference: "REF-2025-04-20-002",
    },
    {
      id: "3",
      description: "Medical Expenses",
      beneficiary: {
        name: "Michael Brown",
        email: "michael.brown@example.com",
      },
      date: "April 15, 2025",
      amount: "₦75,000",
      status: "processing",
      reference: "REF-2025-04-15-003",
    },
    {
      id: "4",
      description: "School Fees",
      beneficiary: {
        name: "David Thompson",
        email: "david.thompson@example.com",
      },
      date: "April 10, 2025",
      amount: "₦180,000",
      status: "completed",
      reference: "REF-2025-04-10-004",
    },
    {
      id: "5",
      description: "Internet Bill",
      beneficiary: {
        name: "Patricia Wilson",
        email: "patricia.wilson@example.com",
      },
      date: "April 5, 2025",
      amount: "₦25,000",
      status: "failed",
      reference: "REF-2025-04-05-005",
    },
  ];

  // Apply filters
  const filteredPayments = paymentsData.filter((payment) => {
    // Apply status filter
    if (statusFilter !== "all" && payment.status !== statusFilter) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        payment.description.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query) ||
        payment.beneficiary.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    if (status === "completed") bgColor = "bg-green-100 text-green-800";
    if (status === "processing") bgColor = "bg-yellow-100 text-yellow-800";
    if (status === "failed") bgColor = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate total amount paid
  const totalPaid = filteredPayments
    .filter(p => p.status === "completed")
    .reduce((sum, payment) => {
      const amountWithoutCurrency = payment.amount.replace(/[^\d]/g, "");
      return sum + Number(amountWithoutCurrency);
    }, 0);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Bills Paid</h1>
        <p className="text-gray-500">
          Track all your bill payments to beneficiaries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#6544E4]">
              ₦{totalPaid.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentsData.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Beneficiaries Supported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(paymentsData.map(p => p.beneficiary.name)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <CardTitle className="text-xl">Payment Records</CardTitle>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#6544E4] focus:border-[#6544E4] w-full text-sm"
              />
            </div>
            
            <div className="flex space-x-2 items-center">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-[#F5F5F5]">
                <TableRow>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#6544E4] text-white text-xs">
                              {getInitials(payment.beneficiary.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payment.beneficiary.name}</div>
                            <div className="text-xs text-gray-500">{payment.beneficiary.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="font-medium">{payment.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">{payment.reference}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No payments found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BillsPaid;
