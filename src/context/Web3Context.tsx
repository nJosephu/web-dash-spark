
import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useWalletConnection } from "../hooks/useWalletConnection";
import { useWalletEvents } from "../hooks/useWalletEvents";
import { Web3ContextType } from "../types/web3";

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
  // Use AuthContext (required)
  const { user } = useAuth();
  
  // Use our wallet connection hook
  const walletConnection = useWalletConnection();
  
  // Set up wallet events
  useWalletEvents({
    address: walletConnection.address,
    disconnectWallet: walletConnection.disconnectWallet,
    refreshBalances: walletConnection.refreshBalances
  });

  return (
    <Web3Context.Provider value={walletConnection}>
      {children}
    </Web3Context.Provider>
  );
};
