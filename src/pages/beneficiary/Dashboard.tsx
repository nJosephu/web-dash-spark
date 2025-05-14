
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import DonutChart from "@/components/dashboard/DonutChart";
import RequestsTable from "@/components/dashboard/RequestsTable";
import PromoBanner from "@/components/dashboard/PromoBanner";
import { useRequests } from "@/hooks/useRequests";
import { useCalculateDashboardMetrics } from "@/hooks/useCalculateDashboardMetrics";
import { StatCardSkeleton, DonutChartSkeleton } from "@/components/dashboard/DashboardSkeleton";

const BeneficiaryDashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || "User";
  const { requests, isLoading } = useRequests();
  const { totalAmount, approvedAmount, rejectedAmount, pendingAmount, chartData } = 
    useCalculateDashboardMetrics(requests);

  useEffect(() => {
    document.title = "Beneficiary Dashboard | Urgent2kay";
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Hi, {userName}</h1>
        <p className="text-gray-500">
          Here's what your Urgent2k beneficiary dashboard looks like today
        </p>
      </div>

      <PromoBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card className="p-4 rounded-lg">
          <h3 className="font-medium mb-3 px-1">Overview</h3>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <StatCard
                title="Total bills requested"
                value={totalAmount}
                color="green"
                colortag="black"
              />
              <StatCard
                title="Approved bill requests"
                value={approvedAmount}
                color="purple"
                colortag="white"
              />
              <StatCard
                title="Rejected bill requests"
                value={rejectedAmount}
                color="red"
                colortag="white"
              />
              <StatCard
                title="Pending bill requests"
                value={pendingAmount}
                color="yellow"
                colortag="black"
              />
            </div>
          )}
        </Card>

        <Card className="p-4 rounded-lg">
          {isLoading ? (
            <DonutChartSkeleton />
          ) : (
            <DonutChart data={chartData} title="Request Rate" />
          )}
        </Card>
      </div>

      <div className="overflow-x-auto">
        <RequestsTable limit={5} showViewAll={true} showPagination={false} />
      </div>
    </>
  );
};

export default BeneficiaryDashboard;
