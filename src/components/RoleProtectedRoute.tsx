
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: string;
}

const RoleProtectedRoute = ({ children, allowedRole }: RoleProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Convert roles to lowercase for case-insensitive comparison
  const userRole = user?.role?.toLowerCase() || "";
  const requiredRole = allowedRole.toLowerCase();

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
