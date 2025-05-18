
import { ethers } from "ethers";
import { toast } from "sonner";
import { NETWORK, CONTRACT_ADDRESSES, U2K_TOKEN_ABI, BILL_PAYMENT_ABI } from "../config/blockchain";

// New function to check if a contract exists at the specified address
export const isContractAvailable = async (
  provider: ethers.providers.Web3Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    // Check if there is code at the address (contracts have code, regular addresses don't)
    const code = await provider.getCode(contractAddress);
    return code !== "0x"; // If code exists, contract exists
  } catch (error) {
    console.error("Error checking contract availability:", error);
    return false;
  }
};

export const initializeContracts = async (provider: ethers.providers.Web3Provider) => {
  const signer = provider.getSigner();
  
  let u2kToken = null;
  let billPaymentContract = null;

  try {
    // Check if token contract exists before initializing
    const tokenContractAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.u2kToken);
    
    if (tokenContractAvailable) {
      u2kToken = new ethers.Contract(
        CONTRACT_ADDRESSES.u2kToken,
        U2K_TOKEN_ABI,
        signer
      );
    } else {
      console.log("U2K Token contract not available on this network");
    }
    
    // Check if bill payment contract exists before initializing
    const billContractAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.billPayment);
    
    if (billContractAvailable) {
      billPaymentContract = new ethers.Contract(
        CONTRACT_ADDRESSES.billPayment,
        BILL_PAYMENT_ABI,
        signer
      );
    } else {
      console.log("Bill Payment contract not available on this network");
    }
  } catch (error) {
    console.error("Error initializing contracts:", error);
  }
  
  return { signer, u2kToken, billPaymentContract };
};

export const getBalances = async (
  provider: ethers.providers.Web3Provider,
  address: string,
  u2kToken: ethers.Contract | null
) => {
  let ethBalance = "0.00";
  let u2kBalance = null;
  
  try {
    // Get ETH balance - this should work regardless of contracts
    ethBalance = ethers.utils.formatEther(await provider.getBalance(address));
  } catch (error) {
    console.error("Error getting ETH balance:", error);
  }
  
  // Only try to get token balance if the contract exists
  if (u2kToken) {
    try {
      const tokenBalance = await u2kToken.balanceOf(address);
      u2kBalance = ethers.utils.formatUnits(tokenBalance, 18);
    } catch (error) {
      console.error("Error getting token balance:", error);
      
      // Check if this is a CALL_EXCEPTION, which indicates the contract doesn't exist
      if (error.code === 'CALL_EXCEPTION') {
        console.log("Token contract not responding - it may not be deployed on this network");
      }
    }
  }
  
  return { ethBalance, u2kBalance };
};

export const switchToNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NETWORK.chainId.toString(16)}` }],
    });
    
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${NETWORK.chainId.toString(16)}`,
              chainName: NETWORK.chainName,
              rpcUrls: [NETWORK.rpcUrl],
              nativeCurrency: NETWORK.nativeCurrency,
              blockExplorerUrls: [NETWORK.blockExplorerUrl],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Error adding chain:", addError);
        toast.error("Failed to add network to MetaMask");
        return false;
      }
    }
    console.error("Error switching chain:", switchError);
    toast.error("Failed to switch network");
    return false;
  }
};
