
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useRequestSponsors } from "@/hooks/useRequestSponsors";
import { Skeleton } from "@/components/ui/skeleton";

const Sponsors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { sponsors, isLoading, sponsorCount, totalFunded } = useRequestSponsors();
  
  useEffect(() => {
    document.title = "My Sponsors | Urgent2kay";
  }, []);

  // Filter sponsors based on search query
  const filteredSponsors = sponsors.filter((sponsor) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      sponsor.name.toLowerCase().includes(query) ||
      (sponsor.email && sponsor.email.toLowerCase().includes(query))
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

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">My Sponsors</h1>
        <p className="text-gray-500">
          People who have funded your requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Sponsors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{sponsorCount}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Funded
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-[#6544E4]">
                ₦{totalFunded.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                ₦{sponsorCount > 0 
                  ? Math.round(totalFunded / sponsorCount).toLocaleString() 
                  : 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Sponsors</CardTitle>
              <CardDescription>
                People who have funded your requests
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search sponsors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSponsors.length > 0 ? (
            <div className="rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-[#F5F5F5]">
                  <TableRow>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Requests Funded</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSponsors.map((sponsor) => (
                    <TableRow key={sponsor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-[#6544E4] text-white">
                              {getInitials(sponsor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{sponsor.name}</div>
                            <div className="text-sm text-gray-500">{sponsor.email || "No email available"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {sponsor.requestsCount}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{sponsor.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(sponsor.lastActivity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-1">No sponsors found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "No sponsors match your search query." 
                  : "You don't have any sponsors yet. Create requests to get funded."}
              </p>
              <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                Create Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Sponsors;
