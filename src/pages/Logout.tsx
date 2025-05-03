
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const { user, logout } = useAuth();
  const userName = user?.name || "User";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Logout | Urgent2kay";
    console.log("Logout page - Auth status:", !!user);
    
    // Check sessionStorage directly to compare with context
    const sessionToken = sessionStorage.getItem('token');
    const sessionUser = sessionStorage.getItem('user');
    console.log("Logout page - SessionStorage check:", {
      hasToken: !!sessionToken,
      hasUser: !!sessionUser,
      contextHasUser: !!user
    });
  }, [user]);

  const handleLogout = () => {
    console.log("Logout requested - clearing auth data");
    // Check sessionStorage before logout
    const beforeToken = sessionStorage.getItem('token');
    const beforeUser = sessionStorage.getItem('user');
    console.log("Before logout - SessionStorage state:", {
      hasToken: !!beforeToken,
      hasUser: !!beforeUser
    });
    
    logout();
    
    // Verify sessionStorage after logout
    setTimeout(() => {
      const afterToken = sessionStorage.getItem('token');
      const afterUser = sessionStorage.getItem('user');
      console.log("After logout - SessionStorage state:", {
        hasToken: !!afterToken,
        hasUser: !!afterUser
      });
    }, 100);
  };

  // If we're at the logout page but not authenticated, redirect to login
  useEffect(() => {
    if (!user) {
      console.log("No user found in Logout page, redirecting to login");
      
      // Double-check sessionStorage before redirect
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      console.log("Logout redirect check - SessionStorage state:", {
        hasToken: !!sessionToken,
        hasUser: !!sessionUser
      });
      
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

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
            <CardContent className="space-y-4">
              <p>Are you sure you want to log out?</p>
              <div className="flex gap-4">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  Yes, Log me out
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Logout;
