
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import BeneficiaryLayout from "./components/layout/BeneficiaryLayout";
import SponsorLayout from "./components/layout/SponsorLayout";
import { mapRoleName } from "./utils/roleUtils";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoleSelection from "./pages/RoleSelection";
import BeneficiarySignUp from "./pages/BeneficiarySignUp";
import SponsorSignUp from "./pages/SponsorSignUp";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";
import SwitchRole from "./pages/SwitchRole";
import Logout from "./pages/Logout";

// Role-specific dashboard pages
import BeneficiaryDashboard from "./pages/dashboards/BeneficiaryDashboard";
import SponsorDashboard from "./pages/dashboards/SponsorDashboard";

// Existing pages to be used in role-specific routes
import Requests from "./pages/Requests";
import BundleDetails from "./pages/BundleDetails";
import Sponsors from "./pages/Sponsors";
import BillHistory from "./pages/BillHistory";
import Settings from "./pages/Settings";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected route component with enhanced logging
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute - Initial auth state:", { 
      isAuthenticated, 
      isLoading, 
      location: window.location.pathname 
    });
    
    // Add a small delay to ensure sessionStorage is populated
    const timeoutId = setTimeout(() => {
      // Double-check authentication status using the token in sessionStorage
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      
      console.log("ProtectedRoute - Checking sessionStorage:", {
        hasToken: !!sessionToken,
        hasUser: !!sessionUser,
        tokenFirstChars: sessionToken ? `${sessionToken.substring(0, 5)}...` : "none"
      });
      
      if (sessionUser) {
        try {
          const userData = JSON.parse(sessionUser);
          console.log("ProtectedRoute - User role:", {
            originalRole: userData.role,
            mappedRole: mapRoleName(userData.role)
          });
        } catch (e) {
          console.error("ProtectedRoute - Error parsing user data:", e);
        }
      }
      
      const isSessionAuth = !!sessionToken && !!sessionUser;
      console.log("ProtectedRoute - Session auth check result:", isSessionAuth);
      
      if (!isLoading && !isSessionAuth) {
        console.log("ProtectedRoute - Not authenticated, redirecting to login");
        // Force logout to clear any inconsistent state
        logout();
        navigate("/login", { replace: true });
      }
      
      setCheckingAuth(false);
    }, 300); // Small delay to ensure sessionStorage is checked after it might be set
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, isAuthenticated, logout, navigate]);

  if (isLoading || checkingAuth) {
    console.log("ProtectedRoute - Showing loading state");
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated after checks, navigating to login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute - Authentication successful, rendering protected content");
  return <>{children}</>;
};

// Dashboard redirect handler
const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      const mappedRole = mapRoleName(user.role);
      console.log("DashboardRedirect - Mapping role:", { 
        originalRole: user.role, 
        mappedRole 
      });
      
      if (mappedRole === "sponsor") {
        navigate("/dashboard/sponsor", { replace: true });
      } else {
        navigate("/dashboard/beneficiary", { replace: true });
      }
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      Redirecting...
    </div>
  );
};

// Moved AppRoutes inside AuthProvider to fix the context issue
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/beneficiary-signup" element={<BeneficiarySignUp />} />
        <Route path="/sponsor-signup" element={<SponsorSignUp />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/switch" element={<SwitchRole />} />
        <Route path="/logout" element={<Logout />} />

        {/* Dashboard redirect */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } 
        />

        {/* Beneficiary Routes */}
        <Route
          path="/dashboard/beneficiary"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRole="beneficiary">
                <BeneficiaryLayout />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<BeneficiaryDashboard />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:bundleId" element={<BundleDetails />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="bill-history" element={<BillHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Sponsor Routes */}
        <Route
          path="/dashboard/sponsor"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRole="sponsor">
                <SponsorLayout />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<SponsorDashboard />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:bundleId" element={<BundleDetails />} />
          <Route path="beneficiaries" element={<Sponsors />} />
          <Route path="payment-history" element={<BillHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App loading - checking sessionStorage");
    // Small timeout to ensure sessionStorage is checked
    setTimeout(() => {
      // Check if we have auth data in sessionStorage
      const token = sessionStorage.getItem('token');
      const user = sessionStorage.getItem('user');
      console.log("Initial app load auth check:", { hasToken: !!token, hasUser: !!user });
      setLoading(false);
    }, 100);
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
