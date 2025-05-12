
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
}

export interface BillResponse {
  message: string;
  bill: Bill;
}

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

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
