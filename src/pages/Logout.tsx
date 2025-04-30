import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Logout = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    document.title = "Logout | Urgent2kay";
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.email) {
      // Extract name from email (for demo purposes)
      const nameFromEmail = userData.email.split('@')[0];
      setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />
        
        <div className="max-w-[100vw] overflow-x-hidden p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle>Logout</CardTitle>
            </CardHeader>
            <CardContent>
              Are you sure you want to log out?
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Logout;
