import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import authService from "./authService";

export interface Provider {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Function to fetch providers
export const fetchProviders = async (): Promise<Provider[]> => {
  try {
    const API_URL =
      "https://urgent-2kay-directed-bill-payment-system-k0rw.onrender.com";
    const token = authService.getToken();

    console.log(
      "Fetching providers with token:",
      token ? "Token exists" : "No token"
    );

    const response = await fetch(`${API_URL}/api/providers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching providers:", errorData);
      throw new Error(errorData.message || "Failed to fetch providers");
    }

    const data = await response.json();
    console.log("Providers fetched successfully:", data);
    return data.providers;
  } catch (error) {
    console.error("Provider fetch error:", error);
    throw error;
  }
};

// Helper function to get provider name by ID
export const getProviderNameById = (
  providers: Provider[],
  id: string
): string => {
  const provider = providers.find((provider) => provider.id === id);
  return provider ? provider.name : id; // Return ID as fallback if provider not found
};

// Hook to use providers data
export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProviders = async () => {
      try {
        setIsLoading(true);
        const providersData = await fetchProviders();
        setProviders(providersData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch providers";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    getProviders();
  }, []);

  return { providers, isLoading, error };
};
