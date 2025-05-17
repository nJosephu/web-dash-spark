
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ExternalLink } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import { ethers } from "ethers";
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";

interface WalletOverviewProps {
  onCreateNewWallet?: () => void;
}

export const WalletOverview = ({ onCreateNewWallet }: WalletOverviewProps) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { web3State, formatEther, shortenAddress } = useWeb3();
  
  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };
  
  // Format balances for display
  const formatBalance = (balance: string | null, symbol: string) => {
    if (!balance) return `0 ${symbol}`;
    return `${Number(ethers.formatEther(balance)).toFixed(4)} ${symbol}`;
  };
  
  // Format USD value
  const getUsdValue = (balance: string | null) => {
    if (!balance) return "$ 0.00";
    // Mock ETH price, would be replaced with real price API
    const ethPrice = 2000;
    const ethValue = Number(ethers.formatEther(balance));
    return `$ ${(ethValue * ethPrice).toFixed(2)}`;
  };
  
  // Get etherscan link for address
  const getExplorerLink = (address: string) => {
    return `${BLOCKCHAIN_CONFIG.BLOCK_EXPLORER}/address/${address}`;
  };

  return (
    <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
      <CardContent className="pt-6">
        {web3State.isConnected ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Wallet Address</p>
              <div className="flex items-center justify-between">
                <code className="bg-[#2D3748] px-2 py-1 rounded text-sm">
                  {web3State.address ? shortenAddress(web3State.address) : 'Not connected'}
                </code>
                <a 
                  href={web3State.address ? getExplorerLink(web3State.address) : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">My balance</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold mr-2">
                  {balanceVisible 
                    ? formatBalance(web3State.ethBalance, "ETH") 
                    : "••••••••"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-transparent"
                  onClick={toggleBalanceVisibility}
                >
                  {balanceVisible ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                {balanceVisible 
                  ? getUsdValue(web3State.ethBalance) 
                  : "••••••••"}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">U2K Token Balance</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">
                  {balanceVisible 
                    ? formatBalance(web3State.u2kBalance, "U2K") 
                    : "••••••••"}
                </p>
              </div>
            </div>

            {/* Network indicator */}
            <div className="bg-gray-800 rounded-md p-3 mb-4">
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${web3State.isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-sm">
                  {web3State.isCorrectNetwork 
                    ? `Connected to ${BLOCKCHAIN_CONFIG.CHAIN_NAME}` 
                    : `Please switch to ${BLOCKCHAIN_CONFIG.CHAIN_NAME}`}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-sm text-gray-400 mb-4 text-center">
              Connect your wallet to view your balance and manage your assets
            </p>
          </div>
        )}

        {/* Chart - placeholder for now */}
        {web3State.isConnected && (
          <div className="h-32 w-full relative mt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full">
              <path
                d="M0,75 C50,50 100,100 150,75 C200,50 250,100 300,75 C350,50 400,100 450,75 C500,50 550,100 600,75"
                fill="none"
                stroke="#F87171"
                strokeWidth="3"
              />
              <path
                d="M0,100 C50,75 100,125 150,100 C200,75 250,125 300,100 C350,75 400,125 450,100 C500,75 550,125 600,100"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-2">
              <span>4K</span>
              <span>2K</span>
              <span>0</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
