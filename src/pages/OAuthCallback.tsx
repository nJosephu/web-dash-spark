
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const OAuthCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const processOAuthResponse = async () => {
      try {
        // Parse query parameters from URL
        const params = new URLSearchParams(search);
        const token = params.get("token");
        const userData = params.get("user");
        const error = params.get("error");

        if (error) {
          toast.error(error || "Authentication failed");
          navigate("/login");
          return;
        }

        if (!token || !userData) {
          toast.error("Invalid authentication response");
          navigate("/login");
          return;
        }

        // Store token and user data in sessionStorage instead of localStorage
        sessionStorage.setItem("token", token);
        const user = JSON.parse(userData);
        sessionStorage.setItem("user", userData);
        sessionStorage.setItem("authenticated", "true");

        // Update auth context
        setToken(token);
        setUser(user);

        toast.success("Login successful");
        navigate("/dashboard");
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
