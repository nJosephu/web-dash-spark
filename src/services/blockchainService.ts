
import { useApi } from "../hooks/useApi";
import { BlockchainBill } from "../config/blockchain";

// Type definitions for API responses
export interface WalletConnectionResponse {
  success: boolean;
  wallet?: {
    address: string;
    userId: string;
  };
  balances?: {
    ETH: string;
    U2K: string;
    USDT?: string;
  };
  error?: string;
}

export interface BlockchainBillResponse {
  success: boolean;
  bill?: BlockchainBill;
  transactionHash?: string;
  error?: string;
}

export interface BlockchainBillsResponse {
  success: boolean;
  bills: BlockchainBill[];
  error?: string;
}

export interface BillPaymentResponse {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Service functions
export const connectWalletToBackend = async (userId: string, walletAddress: string): Promise<WalletConnectionResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/wallets/${userId}/connect`, {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
    
    return response;
  } catch (error: any) {
    console.error('Error connecting wallet to backend:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect wallet to backend',
    };
  }
};

export const getWalletBalance = async (userId: string): Promise<WalletConnectionResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/wallets/${userId}/balance`);
    return response;
  } catch (error: any) {
    console.error('Error getting wallet balance:', error);
    return {
      success: false,
      error: error.message || 'Failed to get wallet balance',
    };
  }
};

export const createBlockchainBill = async (
  sponsorId: string, 
  paymentDestination: string, 
  amount: number,
  description: string,
  userId?: string
): Promise<BlockchainBillResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth('/blockchain/blockchain-bills', {
      method: 'POST',
      body: JSON.stringify({
        sponsorId,
        paymentDestination,
        amount,
        description,
        userId,
        paymentType: 'NATIVE'
      }),
    });
    
    return response;
  } catch (error: any) {
    console.error('Error creating blockchain bill:', error);
    return {
      success: false,
      error: error.message || 'Failed to create blockchain bill',
    };
  }
};

export const getUserBlockchainBills = async (userId: string): Promise<BlockchainBillsResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/blockchain-bills/user/${userId}`);
    return response;
  } catch (error: any) {
    console.error('Error getting user blockchain bills:', error);
    return {
      success: false,
      bills: [],
      error: error.message || 'Failed to get user blockchain bills',
    };
  }
};

export const getBeneficiaryBills = async (address: string): Promise<BlockchainBillsResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/beneficiary-bills/${address}`);
    return response;
  } catch (error: any) {
    console.error('Error getting beneficiary bills:', error);
    return {
      success: false,
      bills: [],
      error: error.message || 'Failed to get beneficiary bills',
    };
  }
};

export const getSponsorBills = async (address: string): Promise<BlockchainBillsResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/sponsor-bills/${address}`);
    return response;
  } catch (error: any) {
    console.error('Error getting sponsor bills:', error);
    return {
      success: false,
      bills: [],
      error: error.message || 'Failed to get sponsor bills',
    };
  }
};

export const payBillWithNative = async (
  blockchainRequestId: string,
  sponsorAddress: string,
  sponsorSignature: string,
  amount: string
): Promise<BillPaymentResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/blockchain-requests/${blockchainRequestId}/pay-native`, {
      method: 'POST',
      body: JSON.stringify({
        sponsorAddress,
        sponsorSignature,
        amount,
      }),
    });
    
    return response;
  } catch (error: any) {
    console.error('Error paying bill with native token:', error);
    return {
      success: false,
      error: error.message || 'Failed to pay bill with native token',
    };
  }
};

export const payBillWithU2K = async (
  blockchainRequestId: string,
  sponsorAddress: string,
  sponsorSignature: string
): Promise<BillPaymentResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/blockchain-requests/${blockchainRequestId}/pay-u2k`, {
      method: 'POST',
      body: JSON.stringify({
        sponsorAddress,
        sponsorSignature,
      }),
    });
    
    return response;
  } catch (error: any) {
    console.error('Error paying bill with U2K token:', error);
    return {
      success: false,
      error: error.message || 'Failed to pay bill with U2K token',
    };
  }
};

export const rejectBill = async (
  blockchainRequestId: string,
  sponsorAddress: string,
  sponsorSignature: string
): Promise<BillPaymentResponse> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/blockchain-requests/${blockchainRequestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        sponsorAddress,
        sponsorSignature,
      }),
    });
    
    return response;
  } catch (error: any) {
    console.error('Error rejecting bill:', error);
    return {
      success: false,
      error: error.message || 'Failed to reject bill',
    };
  }
};

export const getSponsorMetrics = async (sponsorAddress: string): Promise<any> => {
  const { fetchWithAuth } = useApi();
  
  try {
    const response = await fetchWithAuth(`/blockchain/sponsors/${sponsorAddress}/metrics`);
    return response;
  } catch (error: any) {
    console.error('Error getting sponsor metrics:', error);
    return {
      success: false,
      error: error.message || 'Failed to get sponsor metrics',
    };
  }
};
