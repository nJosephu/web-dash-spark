
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSponsorRequests } from "@/hooks/useSponsorRequests";

const IncomingRequests = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { requests, isLoading } = useSponsorRequests();

  // Filter requests based on status and search term
  const filteredRequests = requests.filter(request => {
    // Status filter
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }
    
    // Search filter - check if search term exists in name, requester name, or ID
    if (searchTerm && !request.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !request.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !request.displayId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fund Requests</h1>
        <p className="text-gray-500">Manage and review incoming requests from beneficiaries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All requests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All requests</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 md:flex-[2]">
          <Input 
            placeholder="Search requests..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Button variant="outline" onClick={() => {
            setStatusFilter("all");
            setSearchTerm("");
          }}>
            Clear filters
          </Button>
        </div>
      </div>

      {/* Requests */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border animate-pulse">
              <div className="h-[200px] bg-gray-100"></div>
            </Card>
          ))}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm text-gray-500">{request.displayId}</span>
                    <CardTitle className="text-lg">{request.name}</CardTitle>
                  </div>
                  <Badge className={
                    request.status === "PENDING" ? "bg-yellow-500 text-white" :
                    request.status === "APPROVED" ? "bg-green-500 text-white" :
                    "bg-red-500 text-white"
                  }>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                    <div className="font-bold text-lg">{formatCurrency(request.totalAmount)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="font-semibold">{formatDate(request.createdAt)}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Requester</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 bg-[#6544E4]">
                        <AvatarFallback>{getInitials(request.requester.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{request.requester.name}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-2 bg-[#6544E4] hover:bg-[#5A3DD0]" 
                  asChild
                >
                  <Link to={`/dashboard/sponsor/request/${request.id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border p-8 text-center">
          <div className="mb-4">
            <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No requests found</h3>
          <p className="text-gray-500 mb-4">There are no requests matching your filters.</p>
          <Button variant="outline" onClick={() => {
            setStatusFilter("all");
            setSearchTerm("");
          }}>
            Clear filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default IncomingRequests;
