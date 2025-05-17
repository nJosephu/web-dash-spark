
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/context/Web3Context";
import { Wallet, RefreshCw, LogOut } from "lucide-react";
import { useState } from "react";
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";

interface WalletConnectButtonProps {
  centered?: boolean;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
}

export const WalletConnectButton = ({ centered = false, variant = "default" }: WalletConnectButtonProps) => {
  const { web3State, connectWallet, disconnectWallet, refreshBalances } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConnectWallet = async () => {
    setIsLoading(true);
    await connectWallet();
    setIsLoading(false);
  };
  
  const handleDisconnectWallet = () => {
    disconnectWallet();
  };
  
  const handleRefreshBalances = async () => {
    setIsLoading(true);
    await refreshBalances();
    setIsLoading(false);
  };
  
  return (
    <div className={`${centered ? "flex justify-center" : ""}`}>
      {!web3State.isConnected ? (
        <Button
          variant={variant}
          onClick={handleConnectWallet}
          disabled={isLoading}
          className={`gap-2 ${variant === "default" ? "bg-[#6544E4] hover:bg-[#5335C5]" : ""}`}
        >
          <Wallet size={16} />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="flex gap-2">
          {!web3State.isCorrectNetwork && (
            <Button
              variant="destructive"
              onClick={handleConnectWallet}
              size="sm"
            >
              Switch to {BLOCKCHAIN_CONFIG.CHAIN_NAME}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshBalances}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnectWallet}
          >
            <LogOut size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};
