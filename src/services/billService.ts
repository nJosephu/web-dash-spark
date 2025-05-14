
import authService from "./authService";

export interface CreateBillRequest {
  billName: string;
  type: string;
  amount: number;
  note?: string;
  dueDate: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  providerId: string;
}

export interface Bill {
  id: string;
  billName: string;
  type: string;
  note?: string;
  amount: number;
  priority: string;
  status: string;
  dueDate: string;
  userId: string;
  providerId: string;
  requestId: string | null;
  createdAt: string;
  updatedAt: string;
  providerName?: string; // Add provider name for display purposes
  provider?: {
    name: string;
  };
}

export interface BillResponse {
  message: string;
  bill: Bill;
}

export interface BillsResponse {
  bills: Bill[];
}

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

// Cache key for React Query
export const BILLS_QUERY_KEY = "bills";

// Create a new bill
export const createBill = async (billData: CreateBillRequest, providerName?: string): Promise<BillResponse> => {
  try {
    console.log("Creating bill with data:", billData);
    const token = authService.getToken();
    
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_URL}/api/bills/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(billData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Bill creation failed:", data);
      throw new Error(data.message || "Failed to create bill");
    }

    // Add provider name to the returned bill data for display purposes
    if (providerName) {
      data.bill.providerName = providerName;
    }

    console.log("Bill created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating bill:", error);
    throw error;
  }
};

// Get all bills
export const fetchBills = async (): Promise<BillsResponse> => {
  try {
    console.log("Fetching bills...");
    const token = authService.getToken();
    
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_URL}/api/bills/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Bills fetch failed:", errorData);
      throw new Error(errorData.message || "Failed to fetch bills");
    }

    const data = await response.json();
    console.log("Bills fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

// Delete a bill
export const deleteBill = async (billId: string): Promise<{ message: string }> => {
  try {
    console.log(`Deleting bill with ID: ${billId}`);
    const token = authService.getToken();
    
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${API_URL}/api/bills/${billId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Bill deletion failed:", errorData);
      throw new Error(errorData.message || "Failed to delete bill");
    }

    const data = await response.json();
    console.log("Bill deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error deleting bill:", error);
    throw error;
  }
};
