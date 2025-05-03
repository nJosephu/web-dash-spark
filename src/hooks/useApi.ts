
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

// Basic hook for making authenticated API requests
export const useApi = () => {
  const { token } = useAuth();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

  // Ensure we're using the most up-to-date token from sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken !== sessionToken) {
      console.log("useApi - Updating token from sessionStorage");
      setSessionToken(storedToken);
    }
  }, [token, sessionToken]);

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`useApi - Fetching ${endpoint}`);
      
      // Double check for token in sessionStorage for every request
      const currentToken = sessionStorage.getItem('token') || token;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add auth token if available
      if (currentToken) {
        console.log("useApi - Adding auth token to request");
        headers['Authorization'] = `Bearer ${currentToken}`;
      } else {
        console.log("useApi - No auth token available for request");
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || 'An error occurred';
        console.error(`useApi - Request failed: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      console.log(`useApi - Request to ${endpoint} successful`);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      console.error(`useApi - Error in fetchWithAuth: ${message}`);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { fetchWithAuth, loading, error };
};
