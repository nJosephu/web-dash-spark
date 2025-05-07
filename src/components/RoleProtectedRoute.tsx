
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

// Map backend roles to frontend roles for consistent handling
const mapRoleName = (role: string): string => {
  // Convert to lowercase for case-insensitive comparison
  const normalizedRole = role.toLowerCase();
  
  // Map backend roles to frontend roles
  if (normalizedRole === "benefactee") return "beneficiary";
  if (normalizedRole === "benefactor") return "sponsor";
  
  // If already using frontend role naming convention, return as is
  if (normalizedRole === "beneficiary" || normalizedRole === "sponsor") {
    return normalizedRole;
  }
  
  // Default fallback
  console.warn(`Unknown role type: ${role}`);
  return normalizedRole;
};

const RoleProtectedRoute = ({ children, allowedRole }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [verifiedAuth, setVerifiedAuth] = useState<boolean | null>(null);
  const location = useLocation();
  
  // Enhanced authentication verification on every route change
  useEffect(() => {
    const verifyAuthState = () => {
      // Check sessionStorage directly for most up-to-date status
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      
      console.log("RoleProtectedRoute - Verifying auth state on route:", location.pathname, {
        sessionToken: !!sessionToken,
        sessionUser: !!sessionUser,
        contextAuth: isAuthenticated,
        userInContext: !!user
      });
      
      // If session storage says we're logged out but context thinks we're logged in
      if ((!sessionToken || !sessionUser) && isAuthenticated) {
        console.warn("Auth state mismatch detected - session storage doesn't match context");
        logout(); // Force logout to clear inconsistent state
        setVerifiedAuth(false);
        return;
      }
      
      // Session storage is synced with context
      setVerifiedAuth(!!sessionToken && !!sessionUser);
    };
    
    verifyAuthState();
    
    // Add cache control meta tag to prevent caching protected routes
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Cache-Control');
    metaTag.setAttribute('content', 'no-cache, no-store, must-revalidate');
    document.head.appendChild(metaTag);
    
    return () => {
      // Clean up the meta tag when component unmounts
      document.head.removeChild(metaTag);
    };
  }, [isAuthenticated, user, logout, location.pathname]);
  
  if (isLoading || verifiedAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Get normalized role names for comparison
  const userRole = user ? mapRoleName(user.role || "") : "";
  const requiredRole = mapRoleName(allowedRole);

  console.log("RoleProtectedRoute - Checking access:", {
    originalUserRole: user?.role,
    mappedUserRole: userRole,
    requiredRole: requiredRole,
    isVerifiedAuth: verifiedAuth
  });

  // Check if user is authenticated and has the correct role
  if (!verifiedAuth || userRole !== requiredRole) {
    console.log("Access denied - Current role:", userRole, "Required role:", requiredRole);
    
    if (!verifiedAuth) {
      // If not authenticated at all, redirect to login
      return <Navigate to="/login" replace />;
    } else {
      // If authenticated but wrong role, redirect to their proper dashboard
      const correctPath = userRole === "sponsor" ? "/dashboard/sponsor" : "/dashboard/beneficiary";
      return <Navigate to={correctPath} replace />;
    }
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
