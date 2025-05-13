
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export interface Sponsor {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

export const useSponsors = () => {
  const { fetchWithAuth, loading, error } = useApi();
  
  const { data: sponsors, isLoading, isError } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      try {
        console.log("Fetching sponsors data...");
        const response = await fetchWithAuth('/api/users/benefactors');
        console.log("Sponsors data:", response);
        return response as Sponsor[];
      } catch (err) {
        console.error("Error fetching sponsors:", err);
        throw err;
      }
    },
  });
  
  return {
    sponsors: sponsors || [],
    isLoading: isLoading || loading,
    error: error || (isError ? "Failed to fetch sponsors" : null),
  };
};
