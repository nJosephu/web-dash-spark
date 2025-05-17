
export interface Web3State {
  isConnected: boolean;
  address: string | null;
  provider: any | null;
  signer: any | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  ethBalance: string | null;
  u2kBalance: string | null;
  isConnecting: boolean;
  error: string | null;
}

export interface Bill {
  id: number;
  beneficiary: string;
  paymentDestination: string;
  sponsor: string;
  amount: string;
  description: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  createdAt: number;
  paidAt: number;
}

export interface BlockchainTransaction {
  hash: string;
  type: 'SENT' | 'RECEIVED';
  amount: string;
  recipient?: string;
  sender?: string;
  date: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface BlockchainActivity {
  id: string;
  action: string;
  description: string;
  date: Date;
  amount: string;
  reward?: string;
}
