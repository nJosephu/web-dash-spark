
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import PromoBanner from "@/components/dashboard/PromoBanner";
import StatCard from "@/components/dashboard/StatCard";
import DonutChart from "@/components/dashboard/DonutChart";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, setUser, setToken } = useAuth();
  const userName = user?.name || "User";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard | Urgent2kay";
    
    // Check for token in URL (from Google OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");
    
    if (googleToken) {
      console.log("Dashboard - Google token found in URL parameters");
      
      try {
        // Store the token in sessionStorage (not localStorage to match rest of app)
        sessionStorage.setItem("token", googleToken);
        
        // Try to extract user data from token (JWT)
        let userData = null;
        try {
          // If the token contains user data (JWT payload)
          const base64Url = googleToken.split('.')[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            if (payload) {
              userData = {
                id: payload.sub || payload.id || "",
                email: payload.email || "",
                name: payload.name || "Google User",
                role: payload.role || "beneficiary"
              };
              console.log("Dashboard - Extracted user data from token:", {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role
              });
            }
          }
        } catch (e) {
          console.error("Dashboard - Failed to extract user data from token:", e);
        }
        
        // If we couldn't extract user data, use default
        if (!userData) {
          userData = {
            id: "google-user",
            email: "",
            name: "Google User",
            role: "beneficiary"
          };
          console.log("Dashboard - Using default user data for Google auth");
        }
        
        // Store user data
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("authenticated", "true");
        
        // Update auth context
        setToken(googleToken);
        setUser(userData);
        
        // Clean the URL by removing the token parameter
        navigate("/dashboard", { replace: true });
        
        toast.success("Successfully signed in with Google");
      } catch (error) {
        console.error("Dashboard - Error processing Google token:", error);
        toast.error("Failed to process authentication data");
      }
    } else {
      console.log("Dashboard - No token in URL, normal page load");
    }
  }, [navigate, setToken, setUser]);

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
