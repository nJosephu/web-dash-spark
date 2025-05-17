import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, CirclePlus, ExternalLink, Eye, EyeOff } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";

export const SponsorWalletOverview = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { web3State, formatEther, shortenAddress } = useWeb3();
  
  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };
  
  // Format balances for display
  const formatBalance = (balance: string | null, symbol: string) => {
    if (!balance) return `0 ${symbol}`;
    return `${Number(formatEther(balance)).toFixed(4)} ${symbol}`;
  };
  
  // Format USD value
  const getUsdValue = (balance: string | null) => {
    if (!balance) return "$0.00";
    // Mock ETH price, would be replaced with real price API
    const ethPrice = 2000;
    const ethValue = Number(formatEther(balance));
    return `$${(ethValue * ethPrice).toFixed(2)}`;
  };

  return (
    <Card className="md:col-span-12 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Wallet</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!web3State.isConnected ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <WalletConnectButton />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500">Wallet Address</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono">
                  {web3State.address ? shortenAddress(web3State.address) : 'Not connected'}
                </span>
                <a 
                  href={web3State.address ? `${BLOCKCHAIN_CONFIG.BLOCK_EXPLORER}/address/${web3State.address}` : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <ExternalLink size={14} />
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* ETH Balance */}
              <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                <div className="flex items-start gap-4 mb-2">
                  <div className="p-3 rounded-full bg-[#6544E4]/20">
                    <CircleDollarSign size={20} className="text-[#6544E4]" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">ETH Balance</div>
                    <div className="font-semibold text-2xl">
                      {balanceVisible 
                        ? formatBalance(web3State.ethBalance, "ETH") 
                        : "••••••••"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {balanceVisible 
                        ? `≈ ${getUsdValue(web3State.ethBalance)} USD` 
                        : "•••••••• USD"}
                    </div>
                  </div>
                </div>
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
              
              {/* U2KAY Tokens */}
              <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                <div className="flex items-start gap-4 mb-2">
                  <div className="p-3 rounded-full bg-[#6544E4]/20">
                    <CirclePlus size={20} className="text-[#6544E4]" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">U2KAY Tokens</div>
                    <div className="font-semibold text-2xl">
                      {balanceVisible 
                        ? formatBalance(web3State.u2kBalance, "U2K") 
                        : "••••••••"}
                    </div>
                    <div className="text-gray-500 text-xs">Support rewards</div>
                  </div>
                </div>
              </div>
              
              {/* Support Requests Button */}
              <div className="flex items-center justify-center">
                <Button 
                  className="bg-[#6544E4] hover:bg-[#5A3DD0] w-full h-14 text-base"
                >
                  Support Requests
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
