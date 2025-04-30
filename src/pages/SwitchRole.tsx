import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, BanknoteIcon } from "lucide-react";

const SwitchRole = () => {
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Switch Role | Urgent2kay";

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

  const handleSwitchRole = (role: string) => {
    // Update user role in localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...userData,
        role: role,
      })
    );

    toast.success(`Switched to ${role} role`);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Switch Role</h1>
            <p className="text-gray-500">
              Switch between beneficiary and sponsor roles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border hover:border-[#6544E4] transition-all cursor-pointer">
              <CardHeader>
                <CardTitle>Beneficiary Mode</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="p-4 bg-[#6544E4] rounded-full mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Beneficiary Mode</h3>
                  <p className="text-gray-500 mb-6">
                    Create bill requests and receive funding from sponsors
                  </p>
                  <ul className="text-left space-y-2 mb-8">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Submit bill payment requests
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Track payment status
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Connect with sponsors
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Manage your bill history
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleSwitchRole("beneficiary")}
                    className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Switch to Beneficiary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border hover:border-[#6544E4] transition-all cursor-pointer">
              <CardHeader>
                <CardTitle>Sponsor Mode</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center p-6">
                  <div className="p-4 bg-[#6544E4] rounded-full mb-4">
                    <BanknoteIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Sponsor Mode</h3>
                  <p className="text-gray-500 mb-6">
                    Find and fund bill requests from beneficiaries
                  </p>
                  <ul className="text-left space-y-2 mb-8">
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Browse bill payment requests
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Fund requests directly
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Track your contributions
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 p-1 rounded-full mr-2">
                        ✓
                      </span>
                      Connect with beneficiaries
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleSwitchRole("sponsor")}
                    className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Switch to Sponsor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchRole;
