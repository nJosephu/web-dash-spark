import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import BeneficiaryLayout from "./components/layout/BeneficiaryLayout";
import SponsorLayout from "./components/layout/SponsorLayout";
import { mapRoleName } from "./utils/roleUtils";
import { Web3Provider } from "./context/Web3Context";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoleSelection from "./pages/RoleSelection";
import LandingPage from "./pages/LandingPage";
import BeneficiarySignUp from "./pages/BeneficiarySignUp";
import SponsorSignUp from "./pages/SponsorSignUp";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";
import SwitchRole from "./pages/SwitchRole";
import Logout from "./pages/Logout";

// Role-specific dashboard pages
import BeneficiaryDashboard from "./pages/beneficiary/Dashboard";
import BeneficiaryRequests from "./pages/beneficiary/Requests";
import BeneficiarySponsors from "./pages/beneficiary/Sponsors";
import BeneficiaryBillHistory from "./pages/beneficiary/BillHistory";
import BeneficiarySettings from "./pages/beneficiary/Settings";
import BeneficiaryBundleDetails from "./pages/beneficiary/BeneficiaryBundleDetails";
import BeneficiaryWeb3Wallet from "./pages/beneficiary/Web3Wallet";

import SponsorDashboard from "./pages/sponsor/Dashboard";
import SponsorIncomingRequests from "./pages/sponsor/IncomingRequests";
import SponsorBeneficiaries from "./pages/sponsor/Beneficiaries";
import SponsorBillsPaid from "./pages/sponsor/BillsPaid";
import SponsorSettings from "./pages/sponsor/Settings";
import SponsorBundleDetails from "./pages/sponsor/SponsorBundleDetails";
import WalletAndToken from "./pages/sponsor/WalletAndToken";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected route component with enhanced logging
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute - Initial auth state:", {
      isAuthenticated,
      isLoading,
      location: window.location.pathname,
    });

    // Add a small delay to ensure sessionStorage is populated
    const timeoutId = setTimeout(() => {
      // Double-check authentication status using the token in sessionStorage
      const sessionToken = sessionStorage.getItem("token");
      const sessionUser = sessionStorage.getItem("user");

      console.log("ProtectedRoute - Checking sessionStorage:", {
        hasToken: !!sessionToken,
        hasUser: !!sessionUser,
        tokenFirstChars: sessionToken
          ? `${sessionToken.substring(0, 5)}...`
          : "none",
      });

      if (sessionUser) {
        try {
          const userData = JSON.parse(sessionUser);
          console.log("ProtectedRoute - User role:", {
            originalRole: userData.role,
            mappedRole: mapRoleName(userData.role),
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
    console.log(
      "ProtectedRoute - Not authenticated after checks, navigating to login"
    );
    return <Navigate to="/login" replace />;
  }

  console.log(
    "ProtectedRoute - Authentication successful, rendering protected content"
  );
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
        mappedRole,
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
      <Web3Provider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
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
            <Route path="requests" element={<BeneficiaryRequests />} />
            <Route
              path="requests/:bundleId"
              element={<BeneficiaryBundleDetails />}
            />
            <Route path="sponsors" element={<BeneficiarySponsors />} />
            <Route path="bill-history" element={<BeneficiaryBillHistory />} />
            <Route path="settings" element={<BeneficiarySettings />} />
            <Route path="web3-wallet" element={<BeneficiaryWeb3Wallet />} />
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
            <Route path="requests" element={<SponsorIncomingRequests />} />
            <Route path="requests/:bundleId" element={<SponsorBundleDetails />} />
            <Route path="wallet" element={<WalletAndToken />} />
            {/* <Route path="beneficiaries" element={<SponsorBeneficiaries />} /> */}
            {/* <Route path="bills-paid" element={<SponsorBillsPaid />} /> */}
            <Route path="settings" element={<SponsorSettings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Web3Provider>
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
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");
      console.log("Initial app load auth check:", {
        hasToken: !!token,
        hasUser: !!user,
      });
      setLoading(false);
    }, 100);
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppRoutes />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  );
};

export default App;
