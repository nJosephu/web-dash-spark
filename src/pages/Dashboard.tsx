
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import PromoBanner from "@/components/dashboard/PromoBanner";
import StatCard from "@/components/dashboard/StatCard";
import DonutChart from "@/components/dashboard/DonutChart";
import RequestsTable from "@/components/dashboard/RequestsTable";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Urgent2kay";
  }, []);

  const chartData = [
    { name: "Approved", value: 80, color: "#7B68EE", percentage: 80 },
    { name: "Rejected", value: 10, color: "#FF5252", percentage: 10 },
    { name: "Pending", value: 10, color: "#FFC107", percentage: 10 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-6 w-full md:ml-64">
        <TopNav userName="Caleb" />
        
        <div className="max-w-[100vw] overflow-x-hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Hi, Caleb</h1>
            <p className="text-gray-500">Here's what your Urgent2k dashboard looks like today</p>
          </div>
          
          <PromoBanner />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-3">Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
            
            <div className="w-full overflow-x-auto">
              <DonutChart data={chartData} title="Request Rate" />
            </div>
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
