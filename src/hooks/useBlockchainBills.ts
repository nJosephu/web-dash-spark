
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWeb3 } from "@/context/Web3Context";
import { useAuth } from "@/context/AuthContext";
import { ethers } from "ethers";
import {
  createBlockchainBill,
  getUserBlockchainBills,
  getBeneficiaryBills,
  getSponsorBills,
  payBillWithNative,
  payBillWithU2K,
  rejectBill
} from "@/services/blockchainService";
import { BillStatus } from "@/config/blockchain";

export const useBlockchainBills = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { address, signer } = useWeb3();
  const [isCreatingBill, setIsCreatingBill] = useState(false);

  // Query to get user's blockchain bills
  const { data: userBills, isLoading: isLoadingUserBills, error: userBillsError, refetch: refetchUserBills } = 
    useQuery({
      queryKey: ["userBlockchainBills", user?.id],
      queryFn: async () => {
        if (!user?.id) return { bills: [] };
        const response = await getUserBlockchainBills(user.id);
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch user bills");
        }
        return response;
      },
      enabled: !!user?.id
    });

  // Query to get bills by blockchain address
  const { data: addressBills, isLoading: isLoadingAddressBills, error: addressBillsError, refetch: refetchAddressBills } = 
    useQuery({
      queryKey: ["addressBlockchainBills", address, user?.role],
      queryFn: async () => {
        if (!address) return { bills: [] };
        
        let response;
        if (user?.role === 'beneficiary') {
          response = await getBeneficiaryBills(address);
        } else {
          response = await getSponsorBills(address);
        }
        
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch bills by address");
        }
        return response;
      },
      enabled: !!address && !!user?.role
    });

  // Mutation to create a new bill
  const createBillMutation = useMutation({
    mutationFn: async (billData: {
      sponsorId: string;
      paymentDestination: string;
      amount: number;
      description: string;
    }) => {
      setIsCreatingBill(true);
      try {
        const { sponsorId, paymentDestination, amount, description } = billData;
        const response = await createBlockchainBill(
          sponsorId,
          paymentDestination,
          amount,
          description,
          user?.id
        );
        
        if (!response.success) {
          throw new Error(response.error || "Failed to create bill");
        }
        
        return response;
      } finally {
        setIsCreatingBill(false);
      }
    },
    onSuccess: () => {
      toast.success("Bill created successfully");
      queryClient.invalidateQueries({ queryKey: ["userBlockchainBills"] });
      queryClient.invalidateQueries({ queryKey: ["addressBlockchainBills"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create bill: ${error.message}`);
    }
  });

  // Mutation to pay bill with native token (ETH)
  const payBillWithNativeMutation = useMutation({
    mutationFn: async ({ 
      billId, 
      amount 
    }: { 
      billId: string;
      amount: string;
    }) => {
      if (!address || !signer) {
        throw new Error("Wallet not connected");
      }
      
      // Create message to sign
      const message = `Pay bill ${billId} with ${amount} ETH`;
      
      // Sign message
      const signature = await signer.signMessage(message);
      
      const response = await payBillWithNative(
        billId,
        address,
        signature,
        amount
      );
      
      if (!response.success) {
        throw new Error(response.error || "Failed to pay bill");
      }
      
      return response;
    },
    onSuccess: () => {
      toast.success("Bill paid successfully");
      queryClient.invalidateQueries({ queryKey: ["userBlockchainBills"] });
      queryClient.invalidateQueries({ queryKey: ["addressBlockchainBills"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to pay bill: ${error.message}`);
    }
  });

  // Mutation to pay bill with U2K token
  const payBillWithU2KMutation = useMutation({
    mutationFn: async (billId: string) => {
      if (!address || !signer) {
        throw new Error("Wallet not connected");
      }
      
      // Create message to sign
      const message = `Pay bill ${billId} with U2K tokens`;
      
      // Sign message
      const signature = await signer.signMessage(message);
      
      const response = await payBillWithU2K(
        billId,
        address,
        signature
      );
      
      if (!response.success) {
        throw new Error(response.error || "Failed to pay bill");
      }
      
      return response;
    },
    onSuccess: () => {
      toast.success("Bill paid successfully with U2K tokens");
      queryClient.invalidateQueries({ queryKey: ["userBlockchainBills"] });
      queryClient.invalidateQueries({ queryKey: ["addressBlockchainBills"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to pay bill with U2K: ${error.message}`);
    }
  });

  // Mutation to reject bill
  const rejectBillMutation = useMutation({
    mutationFn: async (billId: string) => {
      if (!address || !signer) {
        throw new Error("Wallet not connected");
      }
      
      // Create message to sign
      const message = `Reject bill ${billId}`;
      
      // Sign message
      const signature = await signer.signMessage(message);
      
      const response = await rejectBill(
        billId,
        address,
        signature
      );
      
      if (!response.success) {
        throw new Error(response.error || "Failed to reject bill");
      }
      
      return response;
    },
    onSuccess: () => {
      toast.success("Bill rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["userBlockchainBills"] });
      queryClient.invalidateQueries({ queryKey: ["addressBlockchainBills"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject bill: ${error.message}`);
    }
  });
  
  // Get the bill status label
  const getBillStatusLabel = (status: BillStatus) => {
    switch (status) {
      case BillStatus.Pending:
        return {
          label: "Pending",
          color: "bg-yellow-900/30 text-yellow-400"
        };
      case BillStatus.Paid:
        return {
          label: "Paid",
          color: "bg-green-900/30 text-green-400"
        };
      case BillStatus.Rejected:
        return {
          label: "Rejected",
          color: "bg-red-900/30 text-red-400"
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-900/30 text-gray-400"
        };
    }
  };

  return {
    // Data
    bills: {
      user: userBills?.bills || [],
      address: addressBills?.bills || []
    },
    
    // Loading states
    isLoading: isLoadingUserBills || isLoadingAddressBills,
    isCreatingBill,
    
    // Errors
    error: userBillsError || addressBillsError,
    
    // Actions
    createBill: createBillMutation.mutate,
    payBillWithNative: payBillWithNativeMutation.mutate,
    payBillWithU2K: payBillWithU2KMutation.mutate,
    rejectBill: rejectBillMutation.mutate,
    
    // Helpers
    getBillStatusLabel,
    
    // Refresh functions
    refetchUserBills,
    refetchAddressBills
  };
};
