
import { ethers } from "ethers";
import { toast } from "sonner";
import { NETWORK, CONTRACT_ADDRESSES, U2K_TOKEN_ABI, BILL_PAYMENT_ABI } from "../config/blockchain";

export const initializeContracts = (provider: ethers.providers.Web3Provider) => {
  const signer = provider.getSigner();
  
  const u2kToken = new ethers.Contract(
    CONTRACT_ADDRESSES.u2kToken,
    U2K_TOKEN_ABI,
    signer
  );
  
  const billPaymentContract = new ethers.Contract(
    CONTRACT_ADDRESSES.billPayment,
    BILL_PAYMENT_ABI,
    signer
  );
  
  return { signer, u2kToken, billPaymentContract };
};

export const getBalances = async (
  provider: ethers.providers.Web3Provider,
  address: string,
  u2kToken: ethers.Contract | null
) => {
  const ethBalance = ethers.utils.formatEther(await provider.getBalance(address));
  
  let u2kBalance = null;
  if (u2kToken) {
    const tokenBalance = await u2kToken.balanceOf(address);
    u2kBalance = ethers.utils.formatUnits(tokenBalance, 18);
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
