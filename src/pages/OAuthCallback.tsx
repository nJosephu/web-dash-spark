
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { getDashboardPathByRole } from "@/utils/roleUtils";

const OAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const processOAuthResponse = async () => {
      try {
        console.log("OAuth callback processing started");
        
        // Parse query parameters from URL
        const params = new URLSearchParams(search);
        const token = params.get("token");
        const userData = params.get("user");
        const error = params.get("error");
        // Get role from URL if it exists (for backend to use)
        const role = params.get("role");
        
        console.log("OAuth params received:", { 
          hasToken: !!token, 
          hasUserData: !!userData, 
          error: error || "none",
          role: role || "not specified",
          tokenFirstChars: token ? `${token.substring(0, 5)}...` : "no token"
        });

        if (error) {
          console.error("OAuth error received:", error);
          toast.error(error || "Authentication failed");
          navigate("/login");
          return;
        }

        if (!token || !userData) {
          console.error("Invalid OAuth response - missing token or user data");
          toast.error("Invalid authentication response");
          navigate("/login");
          return;
        }

        try {
          const user = JSON.parse(userData);
          console.log("OAuth user data parsed successfully:", { 
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role 
          });
          
          // Store token and user data in sessionStorage
          console.log("Storing OAuth data in sessionStorage");
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", userData);
          sessionStorage.setItem("authenticated", "true");
          
          // Double-check storage
          const storedToken = sessionStorage.getItem("token");
          const storedUser = sessionStorage.getItem("user");
          console.log("Verification of sessionStorage data:", { 
            tokenStored: !!storedToken, 
            userStored: !!storedUser,
            tokenMatches: storedToken === token,
            userMatches: storedUser === userData 
          });

          // Update auth context
          console.log("Updating auth context with token and user data");
          setToken(token);
          setUser(user);
          
          // Navigate based on role
          const dashboardPath = getDashboardPathByRole(user.role);
          console.log("Redirecting to dashboard after successful OAuth login:", dashboardPath);

          toast.success("Login successful");
          navigate(dashboardPath);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          toast.error("Failed to process user data");
          navigate("/login");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast.error("Failed to process authentication");
        navigate("/login");
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthResponse();
  }, [navigate, search, setToken, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing login...</h2>
        {isProcessing ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OAuthCallback;
