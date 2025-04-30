
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Logout = () => {
  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem("authenticated");
    toast.success("You have been logged out successfully");
  }, []);

  // Redirect to login page
  return <Navigate to="/login" replace />;
};

export default Logout;
