
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
  providerName?: string;
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
      throw new Error(data.message || "Failed to create bill");
    }

    // Add provider name to the returned bill data for display purposes
    if (providerName) {
      data.bill.providerName = providerName;
    }

    return data;
  } catch (error) {
    console.error("Error creating bill:", error);
    throw error;
  }
};

// Get all bills
export const fetchBills = async (): Promise<BillsResponse> => {
  try {
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
      throw new Error(errorData.message || "Failed to fetch bills");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

// Delete a bill
export const deleteBill = async (billId: string): Promise<{ message: string }> => {
  try {
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
      throw new Error(errorData.message || "Failed to delete bill");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting bill:", error);
    throw error;
  }
};
