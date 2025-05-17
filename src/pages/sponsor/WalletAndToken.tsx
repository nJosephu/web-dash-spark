
import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { SponsorStats } from '@/components/sponsor/wallet/SponsorStats';
import { SponsorWalletOverview } from '@/components/sponsor/wallet/SponsorWalletOverview';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

const WalletAndToken = () => {
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
      <SponsorStats />

      {/* Wallet Section */}
      <SponsorWalletOverview />
    </div>
  );
};

export default WalletAndToken;
