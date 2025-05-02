
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/beneficiary-signup" element={<BeneficiarySignUp />} />
      <Route path="/sponsor-signup" element={<SponsorSignUp />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/requests" element={
        <ProtectedRoute>
          <Requests />
        </ProtectedRoute>
      } />
      <Route path="/requests/:bundleId" element={
        <ProtectedRoute>
          <BundleDetails />
        </ProtectedRoute>
      } />
      <Route path="/sponsors" element={
        <ProtectedRoute>
          <Sponsors />
        </ProtectedRoute>
      } />
      <Route path="/bill-history" element={
        <ProtectedRoute>
          <BillHistory />
        </ProtectedRoute>
      } />
      <Route path="/switch" element={
        <ProtectedRoute>
          <SwitchRole />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/logout" element={
        <ProtectedRoute>
          <Logout />
        </ProtectedRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small timeout to ensure localStorage is checked
    setTimeout(() => setLoading(false), 100);
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
