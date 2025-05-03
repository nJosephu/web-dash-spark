
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../services/authService';

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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const register = async (userInput: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }) => {
    try {
      setIsLoading(true);
      const { token: newToken, user: newUserData } = await authService.register(userInput);
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUserData));
      localStorage.setItem('authenticated', 'true');
      
      // Update state
      setToken(newToken);
      setUser(newUserData);
      
      toast.success("Registration successful");
      
      // Navigate based on role
      navigate('/');
    } catch (error) {
      let message = "Registration failed";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token: newToken, user: userData } = await authService.login(email, password);
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authenticated', 'true');
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      toast.success("Login successful");
      navigate('/');
    } catch (error) {
      let message = "Login failed";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authenticated');
    
    // Reset state
    setToken(null);
    setUser(null);
    
    toast.info("You have been logged out");
    navigate('/login');
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
