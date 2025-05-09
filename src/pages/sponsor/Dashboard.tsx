import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/dashboard/StatCard";
import DonutChart from "@/components/dashboard/DonutChart";
import { Link } from "react-router-dom";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const userName = user?.name || "User";

  useEffect(() => {
    document.title = "Sponsor Dashboard | Urgent2kay";
  }, []);

  const chartData = [
    {
      name: "Funded",
      value: 65,
      color: "#4CAF50",
      percentage: 65,
    },
    {
      name: "Pending",
      value: 25,
      color: "#FFC107",
      percentage: 25,
    },
    {
      name: "Declined",
      value: 10,
      color: "#FF5252",
      percentage: 10,
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Hi, {userName}</h1>
        <p className="text-gray-500">
          Here's what your Urgent2k sponsor dashboard looks like today
        </p>
      </div>

      <div className="bg-[#F1EDFF] rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-medium mb-2">
              Make a difference today
            </h2>
            <p className="text-gray-700 max-w-xl">
              Browse open requests and help someone in need by funding their
              bills directly. Your contribution goes directly to service
              providers.
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[#6544E4] hover:bg-[#5A3DD0]">
            <Link to={"dashboard/sponsor/requests"}></Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card className="p-4 rounded-lg">
          <h3 className="font-medium mb-3 px-1">Your Impact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <StatCard
              title="Total funded"
              value="₦450,000"
              percentChange={15}
              color="green"
            />
            <StatCard
              title="People helped"
              value="24"
              percentChange={8}
              color="purple"
            />
            <StatCard
              title="Average contribution"
              value="₦18,750"
              percentChange={5}
              color="purple"
            />
            <StatCard
              title="Pending reviews"
              value="3"
              percentChange={0}
              color="yellow"
            />
          </div>
        </Card>

        <Card className="p-4 rounded-lg">
          <DonutChart data={chartData} title="Funding Distribution" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="p-4 rounded-lg">
          <h3 className="font-medium mb-3 px-1">Recent Funding Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#F1EDFF] p-2 rounded-full">
                    <Receipt className="h-5 w-5 text-[#6544E4]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Medical Bill Payment</h4>
                    <p className="text-sm text-gray-500">
                      Funded {i} day{i > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦{25000 + i * 5000}</p>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default SponsorDashboard;
