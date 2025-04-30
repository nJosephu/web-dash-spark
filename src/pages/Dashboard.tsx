import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import PromoBanner from "@/components/dashboard/PromoBanner";
import StatCard from "@/components/dashboard/StatCard";
import DonutChart from "@/components/dashboard/DonutChart";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    document.title = "Dashboard | Urgent2kay";

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

  const chartData = [
    {
      name: "Approved",
      value: 80,
      color: "#7B68EE",
      percentage: 80,
    },
    {
      name: "Rejected",
      value: 10,
      color: "#FF5252",
      percentage: 10,
    },
    {
      name: "Pending",
      value: 10,
      color: "#FFC107",
      percentage: 10,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="mb-6">
            <h1 className="text-2xl font-medium">Hi, {userName}</h1>
            <p className="text-gray-500">
              Here's what your Urgent2k dashboard looks like today
            </p>
          </div>

          <PromoBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <Card className="p-4 rounded-lg">
              <h3 className="font-medium mb-3 px-1">Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <StatCard
                  title="Total bills requested"
                  value="₦300,480"
                  percentChange={10}
                  color="green"
                />
                <StatCard
                  title="Approved bill requests"
                  value="₦200,480"
                  percentChange={15}
                  color="purple"
                />
                <StatCard
                  title="Rejected bill requests"
                  value="₦30,000"
                  percentChange={-10}
                  color="red"
                  increaseIsGood={false}
                />
                <StatCard
                  title="Pending bill requests"
                  value="₦70,000"
                  percentChange={20}
                  color="yellow"
                />
              </div>
            </Card>

            <Card className="p-4 rounded-lg">
              <DonutChart data={chartData} title="Request Rate" />
            </Card>
          </div>

          <div className="overflow-x-auto">
            <RequestsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
