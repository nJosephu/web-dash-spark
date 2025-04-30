
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Sponsors from "./pages/Sponsors";
import BillHistory from "./pages/BillHistory";
import SwitchRole from "./pages/SwitchRole";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import TransitionLayout from "./components/layout/TransitionLayout";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Page wrapper with transition effects
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TransitionLayout>
      {children}
    </TransitionLayout>
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
        <TooltipProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            } />
            <Route path="/signup" element={
              <PageWrapper>
                <SignUp />
              </PageWrapper>
            } />
            <Route path="/role-selection" element={
              <PageWrapper>
                <RoleSelection />
              </PageWrapper>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/requests" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Requests />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/sponsors" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Sponsors />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/bill-history" element={
              <ProtectedRoute>
                <PageWrapper>
                  <BillHistory />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/switch" element={
              <ProtectedRoute>
                <PageWrapper>
                  <SwitchRole />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              </ProtectedRoute>
            } />
            <Route path="/logout" element={
              <ProtectedRoute>
                <PageWrapper>
                  <Logout />
                </PageWrapper>
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            } />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
