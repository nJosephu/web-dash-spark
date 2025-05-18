
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { initializeContracts, getBalances, isContractAvailable } from "../utils/web3Utils";
import { NETWORK, CONTRACT_ADDRESSES } from "../config/blockchain";

export const useWalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [u2kBalance, setU2kBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [u2kToken, setU2kToken] = useState<ethers.Contract | null>(null);
  const [billPaymentContract, setBillPaymentContract] = useState<ethers.Contract | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [showMetaMaskAlert, setShowMetaMaskAlert] = useState(false);
  
  // New states for contract availability
  const [isTokenContractAvailable, setIsTokenContractAvailable] = useState(false);
  const [isBillContractAvailable, setIsBillContractAvailable] = useState(false);

  // Check if wallet is already connected in sessionStorage
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('walletAddress');
    if (savedAddress) {
      attemptReconnect();
    }
  }, []);

  // Wallet reconnection function
  const attemptReconnect = async () => {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        const isCorrect = network.chainId === NETWORK.chainId;
        
        setProvider(provider);
        setAddress(accounts[0]);
        setIsConnected(true);
        setIsCorrectNetwork(isCorrect);
        
        // Check contract availability
        await checkContractAvailability(provider);
        
        // Initialize contracts with validation
        const { signer, u2kToken, billPaymentContract } = await initializeContracts(provider);
        setSigner(signer);
        setU2kToken(u2kToken);
        setBillPaymentContract(billPaymentContract);
        
        // Get balances with error handling
        const balances = await getBalances(provider, accounts[0], u2kToken);
        setEthBalance(balances.ethBalance);
        setU2kBalance(balances.u2kBalance);
      }
    } catch (error) {
      console.error("Error reconnecting wallet:", error);
      disconnectWallet();
    }
  };

  // New function to check contract availability
  const checkContractAvailability = async (provider: ethers.providers.Web3Provider) => {
    try {
      const tokenAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.u2kToken);
      const billAvailable = await isContractAvailable(provider, CONTRACT_ADDRESSES.billPayment);
      
      setIsTokenContractAvailable(tokenAvailable);
      setIsBillContractAvailable(billAvailable);
      
      return { tokenAvailable, billAvailable };
    } catch (error) {
      console.error("Error checking contract availability:", error);
      setIsTokenContractAvailable(false);
      setIsBillContractAvailable(false);
      return { tokenAvailable: false, billAvailable: false };
    }
  };

  // Connect wallet
  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      setShowMetaMaskAlert(true);
      return false;
    }

    setIsConnecting(true);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        toast.error("No accounts found");
        setIsConnecting(false);
        return false;
      }
      
      // Check if on correct network
      const network = await provider.getNetwork();
      const isCorrect = network.chainId === NETWORK.chainId;
      setIsCorrectNetwork(isCorrect);
      
      // Set provider
      setProvider(provider);
      
      // Check contract availability before proceeding
      const { tokenAvailable, billAvailable } = await checkContractAvailability(provider);
      
      // Initialize contracts with validation
      const { signer, u2kToken, billPaymentContract } = await initializeContracts(provider);
      setSigner(signer);
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Save to session storage
      sessionStorage.setItem('walletAddress', accounts[0]);
      
      setU2kToken(u2kToken);
      setBillPaymentContract(billPaymentContract);
      
      // Get balances with improved error handling
      try {
        const balances = await getBalances(provider, accounts[0], u2kToken);
        setEthBalance(balances.ethBalance);
        setU2kBalance(balances.u2kBalance);
        
        if (!tokenAvailable) {
          toast.warning("U2K token contract not found on this network. Some features will be limited.");
        }
      } catch (error) {
        console.error("Balance retrieval error:", error);
        
        // Still set the ETH balance if possible
        try {
          const ethBalanceRaw = await provider.getBalance(accounts[0]);
          setEthBalance(ethers.utils.formatEther(ethBalanceRaw));
        } catch (e) {
          console.error("Error getting ETH balance:", e);
        }
        
        // Show appropriate error based on error type
        if (error.code === 'CALL_EXCEPTION') {
          toast.warning("Token contract not available on this network. Some features will be limited.");
        } else {
          toast.error("Couldn't retrieve token balance. Some features may not work.");
        }
      }
      
      if (!isCorrect) {
        toast.warning(
          "You are not connected to Base Sepolia Testnet. Some features may not work.",
          {
            action: {
              label: "Switch Network",
              onClick: () => switchNetwork(),
            },
          }
        );
      } else {
        if (tokenAvailable && billAvailable) {
          toast.success("Wallet connected successfully");
        } else {
          toast.success("Wallet connected, but with limited functionality");
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error(`Failed to connect wallet: ${error.message || "Unknown error"}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setEthBalance(null);
    setU2kBalance(null);
    setProvider(null);
    setSigner(null);
    setU2kToken(null);
    setBillPaymentContract(null);
    sessionStorage.removeItem('walletAddress');
  };

  // Switch network
  const switchNetwork = async (): Promise<boolean> => {
    const success = await import('../utils/web3Utils').then(module => module.switchToNetwork());
    
    if (success && provider) {
      // After successful network switch, check contracts again
      await checkContractAvailability(provider);
      
      // Reinitialize contracts
      const { signer, u2kToken, billPaymentContract } = await initializeContracts(provider);
      setSigner(signer);
      setU2kToken(u2kToken);
      setBillPaymentContract(billPaymentContract);
      
      // Update network status
      setIsCorrectNetwork(true);
      
      // Refresh balances
      if (address) {
        const balances = await getBalances(provider, address, u2kToken);
        setEthBalance(balances.ethBalance);
        setU2kBalance(balances.u2kBalance);
      }
    }
    
    return success;
  };

  // Refresh balances
  const refreshBalances = async (): Promise<void> => {
    if (!provider || !address) return;
    
    try {
      // If we've lost the token contract connection, try to check and reinitialize
      if (!u2kToken) {
        const { tokenAvailable } = await checkContractAvailability(provider);
        if (tokenAvailable) {
          const { u2kToken: newToken } = await initializeContracts(provider);
          setU2kToken(newToken);
        }
      }
      
      const balances = await getBalances(provider, address, u2kToken);
      setEthBalance(balances.ethBalance);
      setU2kBalance(balances.u2kBalance);
    } catch (error) {
      console.error("Error refreshing balances:", error);
      toast.error("Could not refresh balances");
    }
  };

  return {
    isConnected,
    isConnecting,
    address,
    ethBalance,
    u2kBalance,
    provider,
    signer,
    u2kToken,
    billPaymentContract,
    connectWallet,
    disconnectWallet,
    isCorrectNetwork,
    switchNetwork,
    refreshBalances,
    showMetaMaskAlert,
    setShowMetaMaskAlert,
    isTokenContractAvailable,
    isBillContractAvailable
  };
};
