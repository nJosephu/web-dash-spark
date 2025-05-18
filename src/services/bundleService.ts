import authService from "./authService";

export interface CreateBundleRequest {
  name: string;
  notes?: string;
  supporterId: string;
  billIds: string[];
}

export interface BundleResponse {
  message: string;
  request: {
    id: string;
    name: string;
    notes?: string;
    status: string;
    userId: string;
    supporterId: string;
    createdAt: string;
    updatedAt: string;
  };
}

const API_URL =
  "https://urgent-2kay-directed-bill-payment-system-k0rw.onrender.com";

// Create a new bundle (request)
export const createBundle = async (
  bundleData: CreateBundleRequest
): Promise<BundleResponse> => {
  try {
    console.log("Creating bundle with data:", bundleData);
    const token = authService.getToken();

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_URL}/api/requests/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bundleData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Bundle creation failed:", data);
      throw new Error(data.message || "Failed to create bundle");
    }

    console.log("Bundle created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating bundle:", error);
    throw error;
  }
};
