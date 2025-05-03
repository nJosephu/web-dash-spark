
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../services/authService";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  [key: string]: any; // For any additional fields from the API
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Wrapper functions to ensure both state and sessionStorage are updated
  const setUser = (newUser: User | null) => {
    console.log("AuthContext - Setting user:", newUser ? { 
      id: newUser.id, 
      name: newUser.name, 
      role: newUser.role 
    } : "null");
    
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
    }
    
    setUserState(newUser);
  };
  
  const setToken = (newToken: string | null) => {
    console.log("AuthContext - Setting token:", newToken ? 
      `${newToken.substring(0, 5)}...` : "null");
    
    if (newToken) {
      sessionStorage.setItem('token', newToken);
      sessionStorage.setItem('authenticated', 'true');
    } else {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authenticated');
    }
    
    setTokenState(newToken);
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      console.log("AuthContext - Checking initial authentication state");
      
      const storedToken = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("user");

      console.log("AuthContext - Found in sessionStorage:", { 
        hasToken: !!storedToken, 
        hasUser: !!storedUser,
        tokenFirstChars: storedToken ? `${storedToken.substring(0, 5)}...` : "none" 
      });

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("AuthContext - Successfully parsed user:", {
            id: parsedUser.id,
            name: parsedUser.name,
            role: parsedUser.role
          });
          
          setTokenState(storedToken);
          setUserState(parsedUser);
          console.log("AuthContext - Authentication state restored from sessionStorage");
        } catch (error) {
          console.error("AuthContext - Error parsing stored user data:", error);
          // If parsing fails, clear invalid data
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('authenticated');
          setTokenState(null);
          setUserState(null);
        }
      } else {
        // If no token or user, make sure state is reset
        console.log("AuthContext - No valid auth data found, resetting state");
        setTokenState(null);
        setUserState(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Check authentication status periodically
  useEffect(() => {
    // Check every 30 seconds if authentication is still valid
    const interval = setInterval(() => {
      console.log("AuthContext - Periodic authentication check");
      
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      const contextAuthenticated = !!token && !!user;
      const storageAuthenticated = !!sessionToken && !!sessionUser;
      
      console.log("AuthContext - Auth state comparison:", {
        contextAuth: contextAuthenticated,
        storageAuth: storageAuthenticated,
        tokenMatch: sessionToken === token
      });
      
      // If there's a mismatch between context and storage
      if (contextAuthenticated !== storageAuthenticated) {
        console.warn("AuthContext - Authentication state mismatch between context and storage");
        
        if (!storageAuthenticated && contextAuthenticated) {
          console.warn("AuthContext - Session storage shows logged out but context shows logged in - logging out");
          logout();
          toast.error("Your session has expired. Please login again.");
          navigate("/login", { replace: true });
        } else if (storageAuthenticated && !contextAuthenticated) {
          console.warn("AuthContext - Session storage shows logged in but context shows logged out - restoring session");
          try {
            setTokenState(sessionToken);
            setUserState(JSON.parse(sessionUser!));
          } catch (error) {
            console.error("AuthContext - Failed to restore session from storage:", error);
            authService.clearAuth();
          }
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [navigate, user, token]);

  const register = async (userInput: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    try {
      console.log("AuthContext - Starting registration");
      setIsLoading(true);
      const { token: newToken, user: newUserData } = await authService.register(
        userInput
      );

      console.log("AuthContext - Registration successful, saving data");
      
      // Save to sessionStorage
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(newUserData));
      sessionStorage.setItem("authenticated", "true");

      // Update state
      setTokenState(newToken);
      setUserState(newUserData);

      toast.success("Registration successful");
      console.log("AuthContext - Navigating to dashboard after registration");
      
      // Navigate based on role
      navigate("/dashboard");
    } catch (error) {
      let message = "Registration failed";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("AuthContext - Registration error:", message);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext - Starting login process");
      setIsLoading(true);
      const { token: newToken, user: userData } = await authService.login(
        email,
        password
      );

      console.log("AuthContext - Login successful, saving data");
      
      // Save to sessionStorage
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("authenticated", "true");

      // Update state
      setTokenState(newToken);
      setUserState(userData);

      toast.success("Login successful");
      console.log("AuthContext - Navigating to dashboard after login");
      navigate("/dashboard");
    } catch (error) {
      let message = "Login failed";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("AuthContext - Login error:", message);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("AuthContext - Logging out user");
    
    // Clear sessionStorage
    authService.clearAuth();

    // Reset state
    setTokenState(null);
    setUserState(null);

    toast.info("You have been logged out");
    console.log("AuthContext - Redirecting to login page after logout");
    navigate("/login", { replace: true });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
