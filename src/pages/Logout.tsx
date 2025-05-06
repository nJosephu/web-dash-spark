
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const Logout = () => {
  const { user, logout } = useAuth();
  const userName = user?.name || "User";
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(true);

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

  const handleCancel = () => {
    setShowDialog(false);
    window.history.back();
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
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-[#6544E4] hover:bg-[#5A3DD0]"
            >
              Yes, log me out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 w-full md:ml-64">
          <TopNav userName={userName} />
          
          <div className="max-w-[100vw] overflow-x-hidden p-4 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle>Logging out...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Please wait while we log you out.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
