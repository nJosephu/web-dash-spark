
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Get normalized role names for comparison
  const userRole = mapRoleName(user?.role || "");
  const requiredRole = mapRoleName(allowedRole);

  console.log("RoleProtectedRoute - Checking access:", {
    originalUserRole: user?.role,
    mappedUserRole: userRole,
    requiredRole: requiredRole,
    isAuthenticated
  });

  // Check if user is authenticated and has the correct role
  if (!isAuthenticated || userRole !== requiredRole) {
    console.log("Access denied - Current role:", userRole, "Required role:", requiredRole);
    
    if (!isAuthenticated) {
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
