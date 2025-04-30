import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, MessageCircle } from "lucide-react";

const Sponsors = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    document.title = "Sponsors | Urgent2kay";

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

  const sponsorsData = [
    {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      sponsoredAmount: "₦350,000",
      activeRequests: 2,
      joinedDate: "Jan 2025",
      verified: true,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Sarah Williams",
      avatar: "SW",
      sponsoredAmount: "₦280,000",
      activeRequests: 1,
      joinedDate: "Feb 2025",
      verified: true,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "MB",
      sponsoredAmount: "₦420,000",
      activeRequests: 3,
      joinedDate: "Dec 2024",
      verified: true,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Lisa Johnson",
      avatar: "LJ",
      sponsoredAmount: "₦175,000",
      activeRequests: 1,
      joinedDate: "Mar 2025",
      verified: false,
      rating: 4.6,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Sponsors</h1>
              <p className="text-gray-500">
                View and manage your bill sponsors
              </p>
            </div>
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
              Find New Sponsors
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Active Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">3</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Sponsored
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#6544E4]">
                  ₦1,225,000
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#6544E4]" />
                <CardTitle>Your Sponsors</CardTitle>
              </div>
              <CardDescription>
                People who have sponsored your bill requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sponsorsData.map((sponsor) => (
                  <Card key={sponsor.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <div className="bg-[#6544E4] text-white flex items-center justify-center h-full">
                              {sponsor.avatar}
                            </div>
                          </Avatar>
                          <div>
                            <p className="font-medium">{sponsor.name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>Since {sponsor.joinedDate}</span>
                              {sponsor.verified && (
                                <Badge
                                  className="ml-2 bg-green-100 text-green-800"
                                  variant="outline"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Sponsored</p>
                          <p className="font-medium">
                            {sponsor.sponsoredAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Active Requests</p>
                          <p className="font-medium">
                            {sponsor.activeRequests}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{sponsor.rating} Rating</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button variant="outline" size="sm" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" /> Message
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs bg-[#6544E4] hover:bg-[#5A3DD0]"
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
