
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { NETWORK, CONTRACT_ADDRESSES, U2K_TOKEN_ABI, BILL_PAYMENT_ABI } from "../config/blockchain";

// Define the Web3 context types
interface Web3ContextType {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  ethBalance: string | null;
  u2kBalance: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  u2kToken: ethers.Contract | null;
  billPaymentContract: ethers.Contract | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  isCorrectNetwork: boolean;
  switchNetwork: () => Promise<boolean>;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
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
  
  const { user } = useAuth();

  // Check if wallet is already connected in sessionStorage
  useEffect(() => {
    const savedAddress = sessionStorage.getItem('walletAddress');
    if (savedAddress) {
      attemptReconnect();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    // Check if ethereum is available
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
        toast.error("Wallet disconnected");
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        sessionStorage.setItem('walletAddress', accounts[0]);
        refreshBalances();
        toast.info("Account changed");
      }
    };

    const handleChainChanged = (_chainId: string) => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [address]);

  const attemptReconnect = async () => {
    if (!window.ethereum) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        const isCorrect = network.chainId === NETWORK.chainId;
        
        setProvider(provider);
        setSigner(provider.getSigner());
        setAddress(accounts[0]);
        setIsConnected(true);
        setIsCorrectNetwork(isCorrect);
        
        // Initialize contracts
        const u2kToken = new ethers.Contract(
          CONTRACT_ADDRESSES.u2kToken,
          U2K_TOKEN_ABI,
          provider.getSigner()
        );
        setU2kToken(u2kToken);
        
        const billPaymentContract = new ethers.Contract(
          CONTRACT_ADDRESSES.billPayment,
          BILL_PAYMENT_ABI,
          provider.getSigner()
        );
        setBillPaymentContract(billPaymentContract);
        
        await refreshBalances();
      }
    } catch (error) {
      console.error("Error reconnecting wallet:", error);
      disconnectWallet();
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask to use blockchain features");
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
      
      // Set provider and signer
      setProvider(provider);
      setSigner(provider.getSigner());
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Save to session storage
      sessionStorage.setItem('walletAddress', accounts[0]);
      
      // Initialize contracts
      const u2kToken = new ethers.Contract(
        CONTRACT_ADDRESSES.u2kToken,
        U2K_TOKEN_ABI,
        provider.getSigner()
      );
      setU2kToken(u2kToken);
      
      const billPaymentContract = new ethers.Contract(
        CONTRACT_ADDRESSES.billPayment,
        BILL_PAYMENT_ABI,
        provider.getSigner()
      );
      setBillPaymentContract(billPaymentContract);
      
      // Get balances
      await refreshBalances();
      
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

  const switchNetwork = async (): Promise<boolean> => {
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

  const refreshBalances = async (): Promise<void> => {
    if (!provider || !address) return;
    
    try {
      // Get ETH balance
      const balance = await provider.getBalance(address);
      setEthBalance(ethers.utils.formatEther(balance));
      
      // Get U2K balance if contract is available
      if (u2kToken) {
        const u2kBalance = await u2kToken.balanceOf(address);
        setU2kBalance(ethers.utils.formatUnits(u2kBalance, 18));
      }
    } catch (error) {
      console.error("Error refreshing balances:", error);
    }
  };

  const value = {
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
    refreshBalances
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
