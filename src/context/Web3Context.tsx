
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { BLOCKCHAIN_CONFIG, U2K_TOKEN_ABI } from '@/config/blockchain';
import { Web3State } from '@/types/blockchain';

const initialState: Web3State = {
  isConnected: false,
  address: null,
  provider: null,
  signer: null,
  chainId: null,
  isCorrectNetwork: false,
  ethBalance: null,
  u2kBalance: null,
  isConnecting: false,
  error: null,
};

const Web3Context = createContext<{
  web3State: Web3State;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
  shortenAddress: (address: string) => string;
  formatEther: (wei: string) => string;
}>({
  web3State: initialState,
  connectWallet: async () => false,
  disconnectWallet: () => {},
  refreshBalances: async () => {},
  shortenAddress: () => '',
  formatEther: () => '',
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3State, setWeb3State] = useState<Web3State>(initialState);
  const { user } = useAuth();

  // Helper function to format and shorten addresses
  const shortenAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Helper function to format wei to ether
  const formatEther = (wei: string): string => {
    return ethers.formatEther(wei);
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // If window.ethereum exists and we have a previously connected account
        if (window.ethereum && localStorage.getItem('walletConnected') === 'true') {
          await connectWallet();
        }
      } catch (error) {
        console.error('Failed to reconnect wallet:', error);
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
          toast.error('Wallet disconnected');
        } else if (accounts[0] !== web3State.address) {
          // Account changed
          setWeb3State(prev => ({
            ...prev,
            address: accounts[0]
          }));
          refreshBalances();
          toast.info('Account changed');
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16);
        const isCorrectNetwork = chainId === BLOCKCHAIN_CONFIG.CHAIN_ID;
        
        setWeb3State(prev => ({
          ...prev,
          chainId,
          isCorrectNetwork
        }));

        if (!isCorrectNetwork) {
          toast.warning(`Please switch to ${BLOCKCHAIN_CONFIG.CHAIN_NAME}`);
        } else {
          refreshBalances();
          toast.success(`Connected to ${BLOCKCHAIN_CONFIG.CHAIN_NAME}`);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [web3State.address]);

  const connectWallet = async (): Promise<boolean> => {
    setWeb3State(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask or another Ethereum wallet');
        setWeb3State(prev => ({
          ...prev,
          isConnecting: false,
          error: 'No Ethereum wallet found'
        }));
        return false;
      }

      // Request accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        toast.error('No accounts found');
        setWeb3State(prev => ({
          ...prev,
          isConnecting: false,
          error: 'No accounts found'
        }));
        return false;
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      const isCorrectNetwork = chainId === BLOCKCHAIN_CONFIG.CHAIN_ID;

      // If not on the correct network, prompt to switch
      if (!isCorrectNetwork) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${BLOCKCHAIN_CONFIG.CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${BLOCKCHAIN_CONFIG.CHAIN_ID.toString(16)}`,
                    chainName: BLOCKCHAIN_CONFIG.CHAIN_NAME,
                    rpcUrls: [BLOCKCHAIN_CONFIG.RPC_URL],
                    blockExplorerUrls: [BLOCKCHAIN_CONFIG.BLOCK_EXPLORER],
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                  },
                ],
              });
            } catch (addError) {
              console.error('Failed to add network:', addError);
              toast.error('Failed to add network. Please add it manually.');
            }
          } else {
            console.error('Failed to switch network:', switchError);
            toast.error('Failed to switch network. Please switch manually.');
          }
        }
      }

      // Get ETH balance
      const ethBalance = await provider.getBalance(address);

      // Get U2K token balance
      const tokenContract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.U2K_TOKEN_ADDRESS,
        U2K_TOKEN_ABI,
        provider
      );
      
      const u2kBalance = await tokenContract.balanceOf(address);

      // Update state
      setWeb3State({
        isConnected: true,
        address,
        provider,
        signer,
        chainId,
        isCorrectNetwork,
        ethBalance: ethBalance.toString(),
        u2kBalance: u2kBalance.toString(),
        isConnecting: false,
        error: null,
      });

      // Save connection state
      localStorage.setItem('walletConnected', 'true');
      
      // Connect wallet to backend (if we have a user)
      if (user) {
        try {
          // TODO: Connect wallet to backend via API
          // This would be implemented based on your backend API
          console.log('Would connect wallet to backend:', { userId: user.id, walletAddress: address });
        } catch (error) {
          console.error('Failed to connect wallet to backend:', error);
          // Non-critical error, don't disconnect the wallet
        }
      }

      toast.success('Wallet connected successfully');
      return true;
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      let errorMessage = 'Failed to connect wallet';
      if (error.message) {
        errorMessage = error.message.includes('User rejected') 
          ? 'Connection rejected by user'
          : `Error: ${error.message}`;
      }
      
      setWeb3State(prev => ({
        ...prev, 
        isConnecting: false,
        error: errorMessage
      }));
      
      toast.error(errorMessage);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWeb3State(initialState);
    localStorage.removeItem('walletConnected');
    toast.info('Wallet disconnected');
  };

  const refreshBalances = async () => {
    if (!web3State.isConnected || !web3State.provider || !web3State.address) return;
    
    try {
      const provider = web3State.provider;
      const address = web3State.address;
      
      // Get ETH balance
      const ethBalance = await provider.getBalance(address);

      // Get U2K token balance
      const tokenContract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.U2K_TOKEN_ADDRESS,
        U2K_TOKEN_ABI,
        provider
      );
      
      const u2kBalance = await tokenContract.balanceOf(address);

      // Update state with new balances
      setWeb3State(prev => ({
        ...prev,
        ethBalance: ethBalance.toString(),
        u2kBalance: u2kBalance.toString()
      }));
    } catch (error) {
      console.error('Failed to refresh balances:', error);
      toast.error('Failed to refresh balances');
    }
  };

  return (
    <Web3Context.Provider 
      value={{ 
        web3State, 
        connectWallet, 
        disconnectWallet, 
        refreshBalances,
        shortenAddress,
        formatEther
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
