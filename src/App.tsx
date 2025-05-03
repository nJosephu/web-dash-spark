
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import BundleDetails from "./pages/BundleDetails";
import Sponsors from "./pages/Sponsors";
import BillHistory from "./pages/BillHistory";
import SwitchRole from "./pages/SwitchRole";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoleSelection from "./pages/RoleSelection";
import BeneficiarySignUp from "./pages/BeneficiarySignUp";
import SponsorSignUp from "./pages/SponsorSignUp";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import authService from "./services/authService";

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

// Modified AppRoutes to place ALL routes inside AuthProvider
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/beneficiary-signup" element={<BeneficiarySignUp />} />
      <Route path="/sponsor-signup" element={<SponsorSignUp />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:bundleId"
        element={
          <ProtectedRoute>
            <BundleDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sponsors"
        element={
          <ProtectedRoute>
            <Sponsors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bill-history"
        element={
          <ProtectedRoute>
            <BillHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/switch"
        element={
          <ProtectedRoute>
            <SwitchRole />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
        <AuthProvider>
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
