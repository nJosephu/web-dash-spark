import { useAuth } from "@/context/AuthContext";

// Define types for the API response
export interface Bill {
  id: string;
  billName: string;
  amount: number;
  dueDate: string;
  type: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  provider?: {
    id?: string;
    name: string;
  };
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "BENEFACTEE" | "BENEFACTOR";
}

export interface Request {
  id: string;
  name: string;
  notes?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  bills: Bill[];
  requester: User;
  supporter?: User;
  totalAmount?: number;
}

export interface RequestsResponse {
  success: boolean;
  data: Request[];
}

export interface RequestResponse {
  success: boolean;
  data: Request;
}

const API_URL =
  "https://urgent-2kay-directed-bill-payment-system-k0rw.onrender.com";

const requestService = {
  // Get all requests for the logged in user
  getUserRequests: async (
    userId: string,
    token: string
  ): Promise<RequestsResponse> => {
    try {
      console.log(`Fetching requests for user: ${userId}`);

      const response = await fetch(
        `${API_URL}/api/requests/?requesterId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching requests:", errorData);
        throw new Error(errorData.error || "Failed to fetch requests");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Request service error:", error);
      throw error;
    }
  },

  // Get all requests for a specific sponsor
  getSponsorRequests: async (
    sponsorId: string,
    token: string
  ): Promise<RequestsResponse> => {
    try {
      console.log(`Fetching requests for sponsor: ${sponsorId}`);

      const response = await fetch(
        `${API_URL}/api/requests/?supporterId=${sponsorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching sponsor requests:", errorData);
        throw new Error(errorData.error || "Failed to fetch sponsor requests");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Request service error:", error);
      throw error;
    }
  },

  // Get a single request by ID
  getRequestById: async (
    requestId: string,
    token: string
  ): Promise<RequestResponse> => {
    try {
      console.log(`Fetching request details for ID: ${requestId}`);

      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching request details:", errorData);
        throw new Error(errorData.error || "Failed to fetch request details");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Request service error:", error);
      throw error;
    }
  },

  // Cancel a request by ID
  cancelRequest: async (
    requestId: string,
    token: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(
        `${API_URL}/api/requests/${requestId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel request");
      }

      return { success: true };
    } catch (error) {
      console.error("Error cancelling request:", error);
      throw error;
    }
  },

  // Delete a request by ID
  deleteRequest: async (
    requestId: string,
    token: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete request");
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  // Send a reminder for a request
  sendReminder: async (
    requestId: string,
    token: string
  ): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(
        `${API_URL}/api/requests/${requestId}/reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send reminder");
      }

      return { success: true };
    } catch (error) {
      console.error("Error sending reminder:", error);
      throw error;
    }
  },
};

export default requestService;
