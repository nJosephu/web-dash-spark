
import { ethers } from "ethers";

export interface Web3ContextType {
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
  showMetaMaskAlert: boolean;
  setShowMetaMaskAlert: (show: boolean) => void;
  isTokenContractAvailable: boolean;
  isBillContractAvailable: boolean;
}
