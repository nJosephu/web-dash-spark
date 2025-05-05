
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Beneficiary {
  id: number;
  name: string;
  email: string;
  requestsCount: number;
  fundedAmount: string;
  lastActivity: string;
  status: "active" | "inactive";
}

const Beneficiaries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = "Beneficiaries | Urgent2kay";

    // Mock data for beneficiaries
    const mockBeneficiaries: Beneficiary[] = [
      {
        id: 1,
        name: "James Wilson",
        email: "james.wilson@example.com",
        requestsCount: 4,
        fundedAmount: "₦180,000",
        lastActivity: "2 days ago",
        status: "active",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        requestsCount: 2,
        fundedAmount: "₦45,000",
        lastActivity: "5 days ago",
        status: "active",
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        requestsCount: 3,
        fundedAmount: "₦95,000",
        lastActivity: "1 week ago",
        status: "active",
      },
      {
        id: 4,
        name: "David Thompson",
        email: "david.thompson@example.com",
        requestsCount: 1,
        fundedAmount: "₦180,000",
        lastActivity: "2 weeks ago",
        status: "inactive",
      },
      {
        id: 5,
        name: "Patricia Wilson",
        email: "patricia.wilson@example.com",
        requestsCount: 2,
        fundedAmount: "₦25,000",
        lastActivity: "3 weeks ago",
        status: "inactive",
      },
    ];

    // Set beneficiaries data
    setBeneficiaries(mockBeneficiaries);
    setIsLoading(false);
  }, []);

  // Filter beneficiaries based on search query
  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      beneficiary.name.toLowerCase().includes(query) ||
      beneficiary.email.toLowerCase().includes(query)
    );
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Beneficiaries</h1>
        <p className="text-gray-500">
          Manage beneficiaries you've supported
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Beneficiaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiaries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Beneficiaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {beneficiaries.filter(b => b.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Funded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#6544E4]">
              ₦{beneficiaries.reduce((total, b) => {
                const amount = parseInt(b.fundedAmount.replace(/[^\d]/g, ""));
                return total + amount;
              }, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Beneficiaries</CardTitle>
              <CardDescription>
                People you've financially supported
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search beneficiaries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Loading beneficiaries...</div>
          ) : filteredBeneficiaries.length > 0 ? (
            <div className="rounded-md">
              <Table>
                <TableHeader className="bg-[#F5F5F5]">
                  <TableRow>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Funded Amount</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiaries.map((beneficiary) => (
                    <TableRow key={beneficiary.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-[#6544E4] text-white">
                              {getInitials(beneficiary.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{beneficiary.name}</div>
                            <div className="text-sm text-gray-500">{beneficiary.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{beneficiary.requestsCount}</TableCell>
                      <TableCell>{beneficiary.fundedAmount}</TableCell>
                      <TableCell>{beneficiary.lastActivity}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            beneficiary.status === "active" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {beneficiary.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Requests</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">
                No beneficiaries found. Try adjusting your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Beneficiaries;
