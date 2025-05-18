import { useQuery } from "@tanstack/react-query";
import { Sponsor } from "@/types/sponsor";
import authService from "./authService";

// Define a specialized service Sponsor interface that matches the API response format
export interface SponsorApiResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

// Use the consistent API URL, matching what's used in authService.ts
const API_URL =
  "https://urgent-2kay-directed-bill-payment-system-k0rw.onrender.com/";

// Direct fetch function for sponsors
export const fetchSponsors = async (): Promise<SponsorApiResponse[]> => {
  try {
    console.log("Fetching sponsors data...");
    const token = authService.getToken();

    // Add authentication headers if token exists
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      console.log("Adding auth token to sponsor request");
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("No auth token available for sponsor request");
    }

    const response = await fetch(`${API_URL}/api/users/benefactors`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      console.error("Error fetching sponsors:", errorData);
      throw new Error(errorData.message || "Failed to fetch sponsors");
    }

    const data = await response.json();
    console.log("Sponsors data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    throw error;
  }
};

// Hook to fetch sponsors data
export const useSponsors = () => {
  const {
    data: sponsors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sponsors"],
    queryFn: fetchSponsors,
  });

  return {
    sponsors: sponsors || [],
    isLoading,
    error: isError
      ? error instanceof Error
        ? error.message
        : "Failed to fetch sponsors"
      : null,
  };
};
