
import { ethers } from "ethers";
import { toast } from "sonner";
import { NETWORK, CONTRACT_ADDRESSES, U2K_TOKEN_ABI, BILL_PAYMENT_ABI } from "../config/blockchain";

// Enhanced function to check if a contract exists at the specified address with more detailed diagnostics
export const isContractAvailable = async (
  provider: ethers.providers.Web3Provider,
  contractAddress: string
): Promise<boolean> => {
  try {
    // Validate address format first
    if (!ethers.utils.isAddress(contractAddress)) {
      console.error(`Invalid contract address format: ${contractAddress}`);
      return false;
    }
    
    // Get current network to compare with expected network
    const network = await provider.getNetwork();
    const isCorrectNetwork = network.chainId === NETWORK.chainId;
    
    if (!isCorrectNetwork) {
      console.warn(`Connected to wrong network. Expected chainId ${NETWORK.chainId} (${NETWORK.chainName}), but connected to chainId ${network.chainId}`);
    }
    
    // Check if there is code at the address (contracts have code, regular addresses don't)
    const code = await provider.getCode(contractAddress);
    
    // Log more detailed diagnostics
    console.log(`Contract check at ${contractAddress}:`, {
      network: network.name,
      chainId: network.chainId,
      requiredChainId: NETWORK.chainId,
      hasCode: code !== "0x",
      codeLength: code.length
    });
    
    if (code === "0x") {
      console.warn(`No contract found at address ${contractAddress} on network ${network.name} (chainId: ${network.chainId})`);
      return false;
    }
    
    console.log(`Contract found at ${contractAddress} on network ${network.name} (chainId: ${network.chainId})`);
    return true; // If code exists, contract exists
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
    
    const isCorrectNetwork = network.chainId === NETWORK.chainId;
    if (!isCorrectNetwork) {
      console.warn(`Connected to wrong network. Expected ${NETWORK.chainName} (chainId: ${NETWORK.chainId}), but connected to chainId ${network.chainId}`);
    }
    
    // Check if token contract exists before initializing
    const tokenContractAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.u2kToken);
    
    if (tokenContractAvailable) {
      u2kToken = new ethers.Contract(
        CONTRACT_ADDRESSES.u2kToken,
        U2K_TOKEN_ABI,
        signer
      );
      console.log("U2K Token contract initialized successfully");
      
      // Further validation - try to call a method to verify the contract is correct
      try {
        const tokenSymbol = await u2kToken.symbol();
        console.log(`Token contract symbol: ${tokenSymbol}`);
        if (tokenSymbol !== "U2K") {
          console.warn(`Contract at address ${CONTRACT_ADDRESSES.u2kToken} does not appear to be the correct U2K token (symbol: ${tokenSymbol})`);
        }
      } catch (error) {
        console.error("Error validating token contract:", error);
      }
    } else {
      if (!isCorrectNetwork) {
        console.warn(`U2K Token contract not found. You are connected to the wrong network. Please switch to ${NETWORK.chainName}.`);
      } else {
        console.warn(`U2K Token contract not available at address ${CONTRACT_ADDRESSES.u2kToken} even though you're on the correct network. Please verify the contract address.`);
      }
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
      
      // Further validation - try to call a method to verify the contract is correct
      try {
        const billCounter = await billPaymentContract.billCounter();
        console.log(`Bill contract counter: ${billCounter.toString()}`);
      } catch (error) {
        console.error("Error validating bill payment contract:", error);
      }
    } else {
      if (!isCorrectNetwork) {
        console.warn(`Bill Payment contract not found. You are connected to the wrong network. Please switch to ${NETWORK.chainName}.`);
      } else {
        console.warn(`Bill Payment contract not available at address ${CONTRACT_ADDRESSES.billPayment} even though you're on the correct network. Please verify the contract address.`);
      }
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
