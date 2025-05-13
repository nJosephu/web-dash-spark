
import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

interface Request {
  id: number;
  title: string;
  sponsor: string;
  status: 'Completed' | 'Pending' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  created: string;
  dueDate: string;
  description?: string;
  amount?: string;
}

const mockRequests: Request[] = [
  {
    id: 1,
    title: "DSTV Power bill",
    sponsor: "Father",
    status: "Completed",
    priority: "High",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025",
    description: "Monthly subscription for DSTV Premium package",
    amount: "₦18,000"
  },
  {
    id: 2,
    title: "Cloth, shoes and accessories",
    sponsor: "Friend",
    status: "Completed",
    priority: "Medium",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025",
    description: "Purchase of new clothing items for upcoming interview",
    amount: "₦25,000"
  },
  {
    id: 3,
    title: "Airtime & Data",
    sponsor: "Mother",
    status: "Pending",
    priority: "High",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025",
    description: "Monthly data subscription for work and personal use",
    amount: "₦12,000"
  },
  {
    id: 4,
    title: "DSTV Power bill",
    sponsor: "Father",
    status: "Rejected",
    priority: "High",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025",
    description: "Electricity bill payment for apartment",
    amount: "₦22,000"
  }
];

const RequestsTable = () => {
  const [requests] = useState<Request[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter requests based on search query and status
  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch = !searchQuery.trim() || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      request.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b gap-3">
        <h3 className="font-medium">Bill request history</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#6544E4] focus:border-[#6544E4] h-9 w-full md:w-auto"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {filteredRequests.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs uppercase">S/N</TableHead>
                <TableHead className="text-xs uppercase">Request</TableHead>
                <TableHead className="text-xs uppercase">Sponsor</TableHead>
                <TableHead className="text-xs uppercase">Request status</TableHead>
                <TableHead className="text-xs uppercase">Priority</TableHead>
                <TableHead className="text-xs uppercase">Created</TableHead>
                <TableHead className="text-xs uppercase">Due date</TableHead>
                <TableHead className="text-xs uppercase">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.sponsor}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      request.status === 'Completed' ? 'bg-green-50 text-green-700' :
                      request.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      request.priority === 'High' ? 'bg-red-50 text-red-700' :
                      request.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {request.priority}
                    </span>
                  </TableCell>
                  <TableCell>{request.created}</TableCell>
                  <TableCell>{request.dueDate}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#6544E4] flex items-center gap-1"
                      onClick={() => handleViewDetails(request)}
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
            No requests found matching your filters.
          </div>
        )}
      </div>

      {/* Request details modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about this request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Request Title</p>
                  <p className="font-medium">{selectedRequest.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sponsor</p>
                  <p className="font-medium">{selectedRequest.sponsor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded text-xs inline-block mt-1 ${
                    selectedRequest.status === 'Completed' ? 'bg-green-50 text-green-700' :
                    selectedRequest.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <span className={`px-2 py-1 rounded text-xs inline-block mt-1 ${
                    selectedRequest.priority === 'High' ? 'bg-red-50 text-red-700' :
                    selectedRequest.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{selectedRequest.created}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{selectedRequest.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-[#6544E4]">{selectedRequest.amount}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{selectedRequest.description}</p>
              </div>

              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2"
                >
                  Close
                </Button>
                <Button className="bg-[#6544E4] hover:bg-[#5a3dd0]">
                  View Full Details
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
