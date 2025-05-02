
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

// Basic hook for making authenticated API requests
export const useApi = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Add auth token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }
      
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { fetchWithAuth, loading, error };
};
