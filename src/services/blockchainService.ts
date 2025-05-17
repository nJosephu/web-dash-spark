
import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, BILL_PAYMENT_ABI, U2K_TOKEN_ABI } from '@/config/blockchain';
import { Bill, BlockchainTransaction } from '@/types/blockchain';
import authService from './authService';

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

// Helper function to get contract instances
const getContracts = (provider: ethers.Provider, signer?: ethers.Signer) => {
  const tokenContract = new ethers.Contract(
    BLOCKCHAIN_CONFIG.U2K_TOKEN_ADDRESS,
    U2K_TOKEN_ABI,
    signer || provider
  );
  
  const billPaymentContract = new ethers.Contract(
    BLOCKCHAIN_CONFIG.BILL_PAYMENT_ADDRESS,
    BILL_PAYMENT_ABI,
    signer || provider
  );
  
  return { tokenContract, billPaymentContract };
};

const blockchainService = {
  // Connect wallet to the backend
  connectWalletToBackend: async (userId: string, walletAddress: string): Promise<any> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/api/blockchain/wallets/${userId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ walletAddress })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect wallet to backend');
      }

      return await response.json();
    } catch (error) {
      console.error('Error connecting wallet to backend:', error);
      throw error;
    }
  },

  // Get wallet balance from backend
  getWalletBalance: async (userId: string): Promise<any> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/api/blockchain/wallets/${userId}/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get wallet balance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  },

  // Create blockchain bill
  createBlockchainBill: async (
    sponsorId: string,
    paymentDestination: string,
    amount: number,
    description: string,
    userId?: string,
    paymentType: 'NATIVE' | 'U2K_TOKEN' = 'NATIVE'
  ): Promise<any> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/api/blockchain/blockchain-bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sponsorId,
          paymentDestination,
          amount,
          description,
          userId,
          paymentType
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create blockchain bill');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating blockchain bill:', error);
      throw error;
    }
  },

  // Get blockchain bills for a user
  getBlockchainBills: async (userId?: string): Promise<any> => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const url = userId 
        ? `${API_URL}/api/blockchain/blockchain-bills/user/${userId}`
        : `${API_URL}/api/blockchain/blockchain-bills`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get blockchain bills');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting blockchain bills:', error);
      throw error;
    }
  },

  // Get direct blockchain data using ethers.js
  getBlockchainData: async (
    provider: ethers.Provider, 
    address: string
  ): Promise<{
    ethBalance: string,
    u2kBalance: string,
    bills: Bill[],
    transactions: BlockchainTransaction[]
  }> => {
    try {
      const { tokenContract, billPaymentContract } = getContracts(provider);
      
      // Get ETH balance
      const ethBalance = await provider.getBalance(address);
      
      // Get U2K token balance
      const u2kBalance = await tokenContract.balanceOf(address);
      
      // Get bills - this is a placeholder since we need to know role (beneficiary/sponsor)
      // In a complete implementation, we'd check both and filter accordingly
      let billIds: ethers.BigNumberish[] = [];
      try {
        // Try getting beneficiary bills
        billIds = await billPaymentContract.getBeneficiaryBills(address);
      } catch (error) {
        console.log('Not a beneficiary or error:', error);
        // Try getting sponsor bills
        try {
          billIds = await billPaymentContract.getSponsorBills(address);
        } catch (innerError) {
          console.log('Not a sponsor or error:', innerError);
        }
      }
      
      // Get bill details for each ID
      const billPromises = Array.from(billIds).map(async (billId) => {
        try {
          const billData = await billPaymentContract.getBill(billId);
          return {
            id: Number(billData.id),
            beneficiary: billData.beneficiary,
            paymentDestination: billData.paymentDestination,
            sponsor: billData.sponsor,
            amount: billData.amount.toString(),
            description: billData.description,
            status: ['PENDING', 'PAID', 'REJECTED'][Number(billData.status)],
            createdAt: Number(billData.createdAt),
            paidAt: Number(billData.paidAt)
          };
        } catch (error) {
          console.error(`Error fetching bill ${billId}:`, error);
          return null;
        }
      });
      
      const bills = (await Promise.all(billPromises)).filter(bill => bill !== null) as Bill[];
      
      // In a real implementation, we would get transaction history from an indexer or API
      // This is just mock data as a placeholder
      const transactions: BlockchainTransaction[] = [];
      
      return {
        ethBalance: ethBalance.toString(),
        u2kBalance: u2kBalance.toString(),
        bills,
        transactions
      };
    } catch (error) {
      console.error('Error getting blockchain data:', error);
      throw error;
    }
  },

  // Pay bill with native token (ETH)
  payBillWithNative: async (
    blockchainRequestId: string, 
    amount: string, 
    signer: ethers.Signer
  ): Promise<any> => {
    try {
      // Get the signer's address
      const address = await signer.getAddress();
      
      // Create a message to sign
      const message = `Pay bill ${blockchainRequestId} with ${amount} ETH`;
      
      // Sign the message
      const signature = await signer.signMessage(message);
      
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Send to backend
      const response = await fetch(`${API_URL}/api/blockchain/blockchain-requests/${blockchainRequestId}/pay-native`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          sponsorAddress: address,
          sponsorSignature: signature
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to pay bill');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error paying bill with native token:', error);
      throw error;
    }
  },

  // Pay bill with U2K token
  payBillWithU2K: async (
    blockchainRequestId: string, 
    signer: ethers.Signer
  ): Promise<any> => {
    try {
      // Get the signer's address
      const address = await signer.getAddress();
      
      // Create a message to sign
      const message = `Pay bill ${blockchainRequestId} with U2K tokens`;
      
      // Sign the message
      const signature = await signer.signMessage(message);
      
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Send to backend
      const response = await fetch(`${API_URL}/api/blockchain/blockchain-requests/${blockchainRequestId}/pay-u2k`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sponsorAddress: address,
          sponsorSignature: signature
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to pay bill with U2K');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error paying bill with U2K token:', error);
      throw error;
    }
  },

  // Reject bill
  rejectBill: async (
    blockchainRequestId: string, 
    signer: ethers.Signer
  ): Promise<any> => {
    try {
      // Get the signer's address
      const address = await signer.getAddress();
      
      // Create a message to sign
      const message = `Reject bill ${blockchainRequestId}`;
      
      // Sign the message
      const signature = await signer.signMessage(message);
      
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Send to backend
      const response = await fetch(`${API_URL}/api/blockchain/blockchain-requests/${blockchainRequestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sponsorAddress: address,
          sponsorSignature: signature
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject bill');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rejecting bill:', error);
      throw error;
    }
  },

  // Direct contract interaction methods (for backup/advanced usage)
  directCreateBill: async (
    signer: ethers.Signer,
    sponsor: string,
    paymentDestination: string,
    amount: string,
    description: string
  ): Promise<any> => {
    try {
      const { billPaymentContract } = getContracts(null as any, signer);
      
      const tx = await billPaymentContract.createBill(
        sponsor,
        paymentDestination,
        ethers.parseEther(amount),
        description
      );
      
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error creating bill directly:', error);
      throw error;
    }
  },
  
  directPayBillWithNative: async (
    signer: ethers.Signer,
    billId: number,
    amount: string
  ): Promise<any> => {
    try {
      const { billPaymentContract } = getContracts(null as any, signer);
      
      const tx = await billPaymentContract.payBillWithNative(
        billId,
        { value: ethers.parseEther(amount) }
      );
      
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error paying bill directly with native token:', error);
      throw error;
    }
  },
  
  directPayBillWithU2K: async (
    signer: ethers.Signer,
    billId: number
  ): Promise<any> => {
    try {
      const { billPaymentContract, tokenContract } = getContracts(null as any, signer);
      
      // First, approve the bill payment contract to spend U2K tokens
      const bill = await billPaymentContract.getBill(billId);
      await tokenContract.approve(BLOCKCHAIN_CONFIG.BILL_PAYMENT_ADDRESS, bill.amount);
      
      // Then pay the bill
      const tx = await billPaymentContract.payBillWithU2K(billId);
      
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error paying bill directly with U2K token:', error);
      throw error;
    }
  },
  
  directRejectBill: async (
    signer: ethers.Signer,
    billId: number
  ): Promise<any> => {
    try {
      const { billPaymentContract } = getContracts(null as any, signer);
      
      const tx = await billPaymentContract.rejectBill(billId);
      
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error rejecting bill directly:', error);
      throw error;
    }
  },
};

export default blockchainService;
