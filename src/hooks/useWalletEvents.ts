
import { useEffect } from "react";
import { toast } from "sonner";

interface WalletEventsProps {
  address: string | null;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
}

export const useWalletEvents = ({ address, disconnectWallet, refreshBalances }: WalletEventsProps) => {
  // Listen for account changes
  useEffect(() => {
    // Check if ethereum is available
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
        toast.error("Wallet disconnected");
      } else if (accounts[0] !== address) {
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
  }, [address, disconnectWallet, refreshBalances]);
};
