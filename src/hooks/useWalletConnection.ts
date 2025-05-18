
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { initializeContracts, getBalances } from "../utils/web3Utils";
import { NETWORK } from "../config/blockchain";

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
        const { signer, u2kToken, billPaymentContract } = initializeContracts(provider);
        setSigner(signer);
        setAddress(accounts[0]);
        setIsConnected(true);
        setIsCorrectNetwork(isCorrect);
        
        setU2kToken(u2kToken);
        setBillPaymentContract(billPaymentContract);
        
        // Get balances
        const balances = await getBalances(provider, accounts[0], u2kToken);
        setEthBalance(balances.ethBalance);
        setU2kBalance(balances.u2kBalance);
      }
    } catch (error) {
      console.error("Error reconnecting wallet:", error);
      disconnectWallet();
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
      
      // Set provider and contracts
      setProvider(provider);
      const { signer, u2kToken, billPaymentContract } = initializeContracts(provider);
      setSigner(signer);
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Save to session storage
      sessionStorage.setItem('walletAddress', accounts[0]);
      
      setU2kToken(u2kToken);
      setBillPaymentContract(billPaymentContract);
      
      // Get balances
      const balances = await getBalances(provider, accounts[0], u2kToken);
      setEthBalance(balances.ethBalance);
      setU2kBalance(balances.u2kBalance);
      
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
        toast.success("Wallet connected successfully");
      }
      
      return true;
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
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
    return success;
  };

  // Refresh balances
  const refreshBalances = async (): Promise<void> => {
    if (!provider || !address) return;
    
    try {
      const balances = await getBalances(provider, address, u2kToken);
      setEthBalance(balances.ethBalance);
      setU2kBalance(balances.u2kBalance);
    } catch (error) {
      console.error("Error refreshing balances:", error);
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
    setShowMetaMaskAlert
  };
};
