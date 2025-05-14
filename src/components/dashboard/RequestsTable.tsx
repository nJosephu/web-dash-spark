import { useState, useEffect } from "react";
import { Search, Eye, Link as LinkIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBills } from "@/hooks/useBills";
import { Bill } from "@/services/billService";

interface RequestsTableProps {
  limit?: number;
  showViewAll?: boolean;
  showPagination?: boolean;
}

const RequestsTable = ({
  limit = 5,
  showViewAll = true,
  showPagination = true,
}: RequestsTableProps) => {
  const { bills, isLoading, error, deleteBill: deleteBillAction } = useBills();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter bills based on search query and status
  const filteredBills = bills.filter((bill) => {
    // Search filter
    const matchesSearch =
      !searchQuery.trim() ||
      bill.billName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.provider?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      bill.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBills.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  // Get bills for current page
  const currentBills = showPagination
    ? filteredBills.slice(startIndex, endIndex)
    : filteredBills.slice(0, limit);

  const handleViewDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (err) {
      return dateString;
    }
  };

  // Helper function to get priority color class
  const getPriorityClass = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return "bg-red-50 text-red-700";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700";
      case "LOW":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Helper function to get status color class
  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "COMPLETED":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "REJECTED":
      case "FAILED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h3 className="font-medium">Bill request history</h3>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Skeleton className="h-9 w-[180px]" />
            <Skeleton className="h-9 w-[200px]" />
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-red-500 mb-4">{error instanceof Error ? error.message : 'An error occurred'}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-[#6544E4] hover:bg-[#5a3dd0]"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex justify-between items-center w-full">
          <h3 className="font-medium">Bill request history</h3>
          {showViewAll && (
            <Link to="/dashboard/beneficiary/bill-history">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#6544E4] flex items-center gap-1"
              >
                <LinkIcon size={16} />
                <span>View All</span>
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6544E4] focus:border-[#6544E4] h-9 w-full md:w-auto"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {currentBills.length > 0 ? (
          <Table>
            <TableHeader className="bg-[#F3F1F1] border-0">
              <TableRow className="border-0">
                <TableHead className="text-xs uppercase">Bill Name</TableHead>
                <TableHead className="text-xs uppercase">Provider</TableHead>
                <TableHead className="text-xs uppercase">Bill Status</TableHead>
                <TableHead className="text-xs uppercase">Priority</TableHead>
                <TableHead className="text-xs uppercase">Amount</TableHead>
                <TableHead className="text-xs uppercase">Due Date</TableHead>
                <TableHead className="text-xs uppercase">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBills.map((bill) => (
                <TableRow key={bill.id} className="hover:bg-gray-50">
                  <TableCell>{bill.billName}</TableCell>
                  <TableCell>
                    {bill.provider?.name || bill.providerName || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusClass(
                        bill.status
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getPriorityClass(
                        bill.priority
                      )}`}
                    >
                      {bill.priority}
                    </span>
                  </TableCell>
                  <TableCell>₦{bill.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(bill.dueDate)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#6544E4] flex items-center gap-1 p-0"
                      onClick={() => handleViewDetails(bill)}
                    >
                      <Eye size={16} />
                      <span>View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No bills found matching your filters.
          </div>
        )}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Bill details modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>
              Detailed information about this bill
            </DialogDescription>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bill Name</p>
                  <p className="font-medium">{selectedBill.billName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium">
                    {selectedBill.provider?.name ||
                      selectedBill.providerName ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded text-xs inline-block mt-1 ${getStatusClass(
                      selectedBill.status
                    )}`}
                  >
                    {selectedBill.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <span
                    className={`px-2 py-1 rounded text-xs inline-block mt-1 ${getPriorityClass(
                      selectedBill.priority
                    )}`}
                  >
                    {selectedBill.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-[#6544E4]">
                    ₦{selectedBill.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">
                    {formatDate(selectedBill.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedBill.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bill ID</p>
                  <p className="font-medium text-xs text-gray-700">
                    {selectedBill.id}
                  </p>
                </div>
              </div>

              {selectedBill.note && (
                <div>
                  <p className="text-sm text-gray-500">Note</p>
                  <p className="mt-1">{selectedBill.note}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="mt-1">
                  {formatDate(
                    selectedBill.createdAt || new Date().toISOString()
                  )}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestsTable;
