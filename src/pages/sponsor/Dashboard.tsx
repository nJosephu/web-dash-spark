
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import DonutChart from "@/components/dashboard/DonutChart";
import { Link } from "react-router-dom";
import {
  StatCardSkeleton,
  DonutChartSkeleton,
} from "@/components/dashboard/DashboardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useSponsorRequests } from "@/hooks/useSponsorRequests";
import { Badge } from "@/components/ui/badge";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || "User";
  
  // Fetch real data using our hook
  const {
    requests,
    isLoading,
    requestsCount,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
  } = useSponsorRequests();

  useEffect(() => {
    document.title = "Sponsor Dashboard | Urgent2kay";
  }, []);

  // Create chart data based on actual request statuses
  const chartData = [
    {
      name: "Approved",
      value: approvedRequests,
      color: "#4CAF50",
      percentage: requestsCount > 0 ? Math.round((approvedRequests / requestsCount) * 100) : 0,
    },
    {
      name: "Pending",
      value: pendingRequests,
      color: "#FFC107",
      percentage: requestsCount > 0 ? Math.round((pendingRequests / requestsCount) * 100) : 0,
    },
    {
      name: "Rejected",
      value: rejectedRequests,
      color: "#FF5252",
      percentage: requestsCount > 0 ? Math.round((rejectedRequests / requestsCount) * 100) : 0,
    },
  ];

  // Extract recent bills from all requests (for the activity feed)
  const recentBills = requests
    .flatMap(request => 
      request.bills.map(bill => ({
        ...bill,
        requestName: request.name,
        requesterName: request.requester.name,
        requestStatus: request.status,
        requestId: request.id,
        date: request.createdAt, // Using the request creation date for sorting
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Get only the 3 most recent bills

  // Helper function to get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-600";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Helper function to get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-600";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";
      case "LOW":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Hi, {userName}</h1>
        <p className="text-gray-500">
          Here's what your Urgent2k sponsor dashboard looks like today
        </p>
      </div>

      <div className="bg-slate-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl text-white font-medium mb-2">
              Make a difference today
            </h2>
            <p className="text-white max-w-xl">
              Browse open requests and help someone in need by funding their
              bills directly. Your contribution goes directly to service
              providers.
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#6544E4] hover:bg-[#5A3DD0]">
            <Link to="/dashboard/sponsor/requests">Browse Request</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card className="p-4 rounded-lg">
          <h3 className="font-medium mb-3 px-1">Your Impact</h3>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <StatCard 
                title="Total Requests" 
                value={requestsCount.toString()} 
                color="purple" 
              />
              <StatCard 
                title="Approved Requests" 
                value={approvedRequests.toString()} 
                color="green" 
              />
              <StatCard 
                title="Pending Requests" 
                value={pendingRequests.toString()} 
                color="yellow" 
              />
              <StatCard 
                title="Rejected Requests" 
                value={rejectedRequests.toString()} 
                color="red" 
              />
            </div>
          )}
        </Card>

        <Card className="p-4 rounded-lg">
          {isLoading ? (
            <DonutChartSkeleton />
          ) : (
            <DonutChart data={chartData} title="Funding Distribution" />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4 rounded-lg">
          <h3 className="font-medium mb-3 px-1">Recent Funding Activity</h3>
          <div className="space-y-4">
            {isLoading
              ? // Skeleton for funding activity
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  ))
              : recentBills.length > 0 
                ? // Actual bill data
                  recentBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F1EDFF] p-2 rounded-full">
                          <Receipt className="h-5 w-5 text-[#6544E4]" />
                        </div>
                        <div>
                          <h4 className="font-medium">{bill.billName}</h4>
                          <div className="flex gap-2 items-center mt-1">
                            <p className="text-xs text-gray-500">
                              Requested by {bill.requesterName}
                            </p>
                            <Badge className={getPriorityColor(bill.priority)}>
                              {bill.priority.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{bill.amount.toLocaleString()}</p>
                        <Badge className={getStatusColor(bill.requestStatus)}>
                          {bill.requestStatus.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  ))
                : // No bills available
                  <div className="flex items-center justify-center py-6 text-gray-500">
                    No recent bill activity found
                  </div>
              }
          </div>
        </Card>
      </div>
    </>
  );
};

export default SponsorDashboard;
