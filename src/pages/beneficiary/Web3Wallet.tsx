
import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { WalletStats } from "@/components/wallet/WalletStats";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { RequestCreator } from "@/components/wallet/RequestCreator";
import { RequestHistory } from "@/components/wallet/RequestHistory";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

const Web3Wallet = () => {
  const { web3State } = useWeb3();

  return (
    <div className="py-6">
      {/* Connect wallet button if not connected */}
      {!web3State.isConnected && (
        <div className="text-center mb-6 p-8 bg-[#1A1F2C] rounded-lg">
          <h2 className="text-2xl font-semibold mb-2 text-white">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6">
            Connect your cryptocurrency wallet to access Web3 features, view your balances, and manage your blockchain transactions.
          </p>
          <WalletConnectButton centered />
        </div>
      )}

      {/* Stats cards */}
      <WalletStats />

      {/* Wallet and Request Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Wallet Section */}
        <WalletOverview />

        {/* Create Request Section */}
        <RequestCreator />
      </div>

      {/* Request History Section */}
      <RequestHistory />
    </div>
  );
};

export default Web3Wallet;
