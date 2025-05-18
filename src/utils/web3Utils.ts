import { ethers } from "ethers";
import { toast } from "sonner";
import { NETWORK, CONTRACT_ADDRESSES, U2K_TOKEN_ABI, BILL_PAYMENT_ABI } from "../config/blockchain";

// Enhanced function to check if a contract exists at the specified address
export const isContractAvailable = async (
  provider: ethers.providers.Web3Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    console.log(`Checking contract at address ${contractAddress}...`);
    
    // First verify the address format is valid
    if (!ethers.utils.isAddress(contractAddress)) {
      console.error(`Invalid address format: ${contractAddress}`);
      return false;
    }
    
    // Get current network to provide context for debugging
    const network = await provider.getNetwork();
    console.log(`Current network: Chain ID ${network.chainId} (${network.name})`);
    console.log(`Target network: Chain ID ${NETWORK.chainId} (${NETWORK.chainName})`);
    
    // Check if we're on the expected network
    if (network.chainId !== NETWORK.chainId) {
      console.warn(`Network mismatch! Contract check may fail. Expected chain ID ${NETWORK.chainId}, but connected to ${network.chainId}`);
    }
    
    // Check if there is code at the address (contracts have code, regular addresses don't)
    const code = await provider.getCode(contractAddress);
    
    // Log the actual bytecode length for debugging
    console.log(`Contract check at ${contractAddress}: Code length: ${(code.length - 2) / 2} bytes`);
    
    if (code === "0x") {
      console.warn(`No contract found at address ${contractAddress} on chain ID ${network.chainId}`);
      console.log(`Possible reasons: 
        1. Contract not deployed to this network
        2. Contract address is incorrect
        3. Contract was deployed but has self-destructed`);
      return false;
    }
    
    console.log(`Contract verified at ${contractAddress} on chain ID ${network.chainId}`);
    return true; // If code exists, contract exists
  } catch (error) {
    console.error("Error checking contract availability:", error);
    if (error.code === 'NETWORK_ERROR') {
      console.error("Network connection issue. Check your internet connection or RPC endpoint.");
    } else if (error.code === 'SERVER_ERROR') {
      console.error("RPC server error. The network endpoint may be down or overloaded.");
    }
    return false;
  }
};

export const initializeContracts = async (provider: ethers.providers.Web3Provider) => {
  const signer = provider.getSigner();
  
  let u2kToken = null;
  let billPaymentContract = null;

  try {
    // Get current network to provide better error information
    const network = await provider.getNetwork();
    console.log("Connected to network:", { 
      name: network.name, 
      chainId: network.chainId 
    });
    console.log("Required network:", { 
      name: NETWORK.chainName, 
      chainId: NETWORK.chainId 
    });
    
    // Check if token contract exists before initializing
    const tokenContractAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.u2kToken);
    
    if (tokenContractAvailable) {
      u2kToken = new ethers.Contract(
        CONTRACT_ADDRESSES.u2kToken,
        U2K_TOKEN_ABI,
        signer
      );
      console.log("U2K Token contract initialized successfully");
    } else {
      console.warn("U2K Token contract not available at address", CONTRACT_ADDRESSES.u2kToken);
    }
    
    // Check if bill payment contract exists before initializing
    const billContractAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.billPayment);
    
    if (billContractAvailable) {
      billPaymentContract = new ethers.Contract(
        CONTRACT_ADDRESSES.billPayment,
        BILL_PAYMENT_ABI,
        signer
      );
      console.log("Bill Payment contract initialized successfully");
    } else {
      console.warn("Bill Payment contract not available at address", CONTRACT_ADDRESSES.billPayment);
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
    console.log(`Attempting to switch to network with chainId: 0x${NETWORK.chainId.toString(16)}`);
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${NETWORK.chainId.toString(16)}` }],
    });
    
    console.log("Successfully switched to network");
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        console.log("Network not found in wallet, attempting to add it");
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
        console.log("Network successfully added to wallet");
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
