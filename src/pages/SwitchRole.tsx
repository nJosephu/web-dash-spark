
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, BanknoteIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import TopNav from "@/components/layout/TopNav";
import { mapRoleName } from "@/utils/roleUtils";

const SwitchRole = () => {
  const { user, setUser } = useAuth();
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Switch Role | Urgent2kay";

    if (user?.name) {
      setUserName(user.name);
    } else if (user?.email) {
      // Extract name from email (for demo purposes)
      const nameFromEmail = user.email.split("@")[0];
      setUserName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }
  }, [user]);

  const handleSwitchRole = (role: string) => {
    // Determine the correct backend role name to set
    const backendRole = role === "beneficiary" ? "BENEFACTEE" : "BENEFACTOR";
    
    // Update user role in sessionStorage and context
    const updatedUser = { ...user, role: backendRole };
    
    // Update sessionStorage
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update auth context
    setUser(updatedUser);

    toast.success(`Switched to ${role} role`);
    
    // Navigate to the appropriate dashboard
    if (role.toLowerCase() === "beneficiary") {
      navigate("/dashboard/beneficiary");
    } else if (role.toLowerCase() === "sponsor") {
      navigate("/dashboard/sponsor");
    }
  };

  // Get the current mapped role for UI display
  const currentRole = user ? mapRoleName(user.role) : "";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <TopNav userName={userName} />
        
        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-bold">Switch Role</h1>
          <p className="text-gray-500">
            Switch between beneficiary and sponsor roles
          </p>
          {currentRole && (
            <p className="text-sm bg-slate-100 p-2 mt-2 rounded">
              Current role: <span className="font-bold">{currentRole}</span>
            </p>
          )}
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
                  disabled={currentRole === "beneficiary"}
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
                  disabled={currentRole === "sponsor"}
                >
                  Switch to Sponsor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SwitchRole;
