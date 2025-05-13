
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
import { Search, Download } from "lucide-react";

interface Bill {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  reference: string;
}

const BillHistory = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    document.title = "Bill History | Urgent2kay";
  }, []);

  // Mock data for bill history
  const billsData: Bill[] = [
    {
      id: "1",
      description: "Electricity Bill",
      date: "April 25, 2025",
      amount: "₦45,000",
      status: "paid",
      reference: "REF-2025-04-25-001",
    },
    {
      id: "2",
      description: "Water Bill",
      date: "April 20, 2025",
      amount: "₦15,000",
      status: "paid",
      reference: "REF-2025-04-20-002",
    },
    {
      id: "3",
      description: "Internet Subscription",
      date: "April 15, 2025",
      amount: "₦25,000",
      status: "pending",
      reference: "REF-2025-04-15-003",
    },
    {
      id: "4",
      description: "Rent Payment",
      date: "April 10, 2025",
      amount: "₦120,000",
      status: "paid",
      reference: "REF-2025-04-10-004",
    },
    {
      id: "5",
      description: "Gas Bill",
      date: "April 5, 2025",
      amount: "₦8,500",
      status: "failed",
      reference: "REF-2025-04-05-005",
    },
    {
      id: "6",
      description: "TV Subscription",
      date: "April 1, 2025",
      amount: "₦9,000",
      status: "paid",
      reference: "REF-2025-04-01-006",
    },
  ];

  // Apply filters
  const filteredBills = billsData.filter((bill) => {
    // Apply status filter
    if (statusFilter !== "all" && bill.status !== statusFilter) {
      return false;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bill.description.toLowerCase().includes(query) ||
        bill.reference.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    if (status === "paid") bgColor = "bg-green-100 text-green-800";
    if (status === "pending") bgColor = "bg-yellow-100 text-yellow-800";
    if (status === "failed") bgColor = "bg-red-100 text-red-800";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Bill History</h1>
        <p className="text-gray-500">
          View and track all your past bill payments
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <CardTitle className="text-xl">Payment History</CardTitle>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search bills..."
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.description}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>
                        <StatusBadge status={bill.status} />
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{bill.reference}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No bills found. Try adjusting your search or filters.
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

export default BillHistory;
