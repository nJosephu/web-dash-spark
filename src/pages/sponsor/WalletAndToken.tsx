import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import MetaMaskAlert from "@/components/blockchain/MetaMaskAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CircleDollarSign,
  Filter,
  Plus,
  Search,
  Wallet,
  Eye,
  EyeOff,
  ExternalLink,
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBlockchainBills } from "@/hooks/useBlockchainBills";
import { shortenAddress, formatEthAmount } from "@/config/blockchain";
import { ethers } from "ethers";
import { NETWORK } from "@/config/blockchain";

const WalletAndToken = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isConnected, 
    isConnecting, 
    address, 
    ethBalance, 
    u2kBalance, 
    connectWallet,
    isCorrectNetwork,
    switchNetwork,
    refreshBalances,
    showMetaMaskAlert,
    setShowMetaMaskAlert,
    isTokenContractAvailable,
    isBillContractAvailable
  } = useWeb3();
  
  const {
    bills,
    isLoading: isLoadingBills,
    payBillWithNative,
    payBillWithU2K,
    rejectBill,
    getBillStatusLabel
  } = useBlockchainBills();
  
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<'ETH' | 'U2K'>('ETH');

  // Calculate stats based on blockchain bills
  const calculateStats = () => {
    const billsArray = bills.address || [];
    
    const totalRequested = billsArray.reduce((sum, bill) => {
      return sum + parseFloat(ethers.utils.formatEther(bill.amount));
    }, 0);
    
    const approved = billsArray
      .filter(bill => bill.status === 1) // Status 1 = Paid
      .reduce((sum, bill) => {
        return sum + parseFloat(ethers.utils.formatEther(bill.amount));
      }, 0);
      
    const rejected = billsArray
      .filter(bill => bill.status === 2) // Status 2 = Rejected
      .reduce((sum, bill) => {
        return sum + parseFloat(ethers.utils.formatEther(bill.amount));
      }, 0);
      
    const pending = billsArray
      .filter(bill => bill.status === 0) // Status 0 = Pending
      .reduce((sum, bill) => {
        return sum + parseFloat(ethers.utils.formatEther(bill.amount));
      }, 0);
    
    return [
      {
        title: "Total Bills Received",
        value: `${totalRequested.toFixed(6)} ETH`,
        increase: totalRequested > 0 ? "Active" : "No requests",
        increaseText: "Total on blockchain",
        color: "bg-green-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
      {
        title: "Approved Bill Requests",
        value: `${approved.toFixed(6)} ETH`,
        increase: approved > 0 ? "Paid" : "None yet",
        increaseText: "Successful payments",
        color: "bg-purple-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
      {
        title: "Rejected Bill Requests",
        value: `${rejected.toFixed(6)} ETH`,
        increase: rejected > 0 ? "Rejected" : "None",
        increaseText: "Denied requests",
        color: "bg-red-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
      {
        title: "Pending Bill Requests",
        value: `${pending.toFixed(6)} ETH`,
        increase: pending > 0 ? "Awaiting" : "None pending",
        increaseText: "Need your review",
        color: "bg-yellow-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
    ];
  };

  const statsData = calculateStats();

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  // Handle MetaMask connect attempt
  const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (!result && !window.ethereum) {
      setShowMetaMaskAlert(true);
    }
  };

  // Handle opening the payment dialog
  const handleOpenPaymentDialog = (bill: any, type: 'ETH' | 'U2K') => {
    setSelectedBill(bill);
    setPaymentType(type);
    setIsPaymentDialogOpen(true);
  };

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!selectedBill) return;
    
    try {
      if (paymentType === 'ETH') {
        await payBillWithNative({
          billId: selectedBill.id,
          amount: ethers.utils.formatEther(selectedBill.amount)
        });
        toast({
          title: "Payment Successful",
          description: `Payment with ${paymentType} processed successfully`,
          variant: "default",
        });
      } else {
        await payBillWithU2K(selectedBill.id);
        toast({
          title: "Payment Successful",
          description: `Payment with ${paymentType} processed successfully`,
          variant: "default",
        });
      }
      setIsPaymentDialogOpen(false);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: `Failed to process payment: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Handle bill rejection
  const handleRejectBill = async (billId: string) => {
    try {
      await rejectBill(billId);
      toast({
        title: "Bill Rejected",
        description: "Bill rejected successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        title: "Rejection Failed",
        description: `Failed to reject bill: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Format the bills for display
  const pendingBillsData = bills.address ? bills.address
    .filter(bill => bill.status === 0) // Only show pending bills
    .map((bill) => {
      const status = getBillStatusLabel(bill.status);
      return {
        id: bill.id.toString(),
        request: bill.description || "Blockchain Bill Request",
        beneficiary: shortenAddress(bill.beneficiary || ''),
        status: status.label,
        statusColor: status.color,
        priority: parseFloat(ethers.utils.formatEther(bill.amount)) > 0.1 ? "High" : "Medium",
        created: new Date(bill.createdAt * 1000).toLocaleDateString(),
        amount: `${formatEthAmount(ethers.utils.formatEther(bill.amount))} ETH`,
        rawAmount: bill.amount
      };
    }) : [];

  const processedBillsData = bills.address ? bills.address
    .filter(bill => bill.status !== 0) // Only show processed bills
    .map((bill) => {
      const status = getBillStatusLabel(bill.status);
      return {
        id: bill.id.toString(),
        request: bill.description || "Blockchain Bill Request",
        beneficiary: shortenAddress(bill.beneficiary || ''),
        status: status.label,
        statusColor: status.color,
        priority: parseFloat(ethers.utils.formatEther(bill.amount)) > 0.1 ? "High" : "Medium",
        created: new Date(bill.createdAt * 1000).toLocaleDateString(),
        processed: bill.processedAt ? new Date(bill.processedAt * 1000).toLocaleDateString() : '-',
        amount: `${formatEthAmount(ethers.utils.formatEther(bill.amount))} ETH`,
      };
    }) : [];

  return (
    <div className="py-6">
      {/* MetaMask Alert Dialog */}
      <MetaMaskAlert 
        isOpen={showMetaMaskAlert} 
        onClose={() => setShowMetaMaskAlert(false)} 
      />
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-[#1A1F2C] text-white border-none shadow-md"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`p-1.5 rounded-full ${stat.color} mr-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-xs text-gray-400">{stat.title}</p>
                </div>
                <div className="flex items-center text-xs text-green-400">
                  <span className="mr-1">{stat.increase}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-1">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.increaseText}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wallet and Pay Bills Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Wallet Section */}
        <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Wallet</CardTitle>
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={refreshBalances}
              >
                <Plus className="h-4 w-4 mr-1" /> Refresh balance
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Wallet size={32} className="text-gray-500" />
                </div>
                <h3 className="font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 text-sm text-center mb-6 max-w-md">
                  Connect your crypto wallet to view your balance and manage bill payments
                </p>
                <Button 
                  className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Wallet Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{shortenAddress(address || '')}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => {
                        window.open(`${NETWORK.blockExplorerUrl}/address/${address}`, '_blank');
                      }}
                    >
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
                
                {!isCorrectNetwork && (
                  <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Wrong Network</p>
                      <p className="text-sm">Please connect to Base Sepolia Testnet</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                      onClick={switchNetwork}
                    >
                      Switch Network
                    </Button>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* ETH Balance */}
                  <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="p-3 rounded-full bg-[#6544E4]/20">
                        <CircleDollarSign size={20} className="text-[#6544E4]" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">ETH Balance</div>
                        <div className="font-semibold text-2xl">
                          {balanceVisible ? (ethBalance || "0.00") : "••••••••"}
                        </div>
                        <div className="text-gray-400 text-xs">Base Sepolia Testnet</div>
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
                        <Wallet size={20} className="text-[#6544E4]" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">U2K Tokens</div>
                        <div className="font-semibold text-2xl">
                          {balanceVisible ? (u2kBalance || "0.00") : "••••••••"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {isTokenContractAvailable 
                            ? "Available for payments" 
                            : "Token contract not available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pay Bills Section */}
        <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pay Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-6">
              Review and pay incoming bill requests from beneficiaries. You can pay with ETH or U2K tokens.
              All transactions are recorded on the blockchain for transparency.
            </p>
            
            {!isBillContractAvailable && (
              <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-400 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">Bill Contract Not Available</p>
                <p className="text-sm">The bill payment contract is not available on this network. Please switch to Base Sepolia Testnet.</p>
              </div>
            )}
            
            {pendingBillsData.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                {isConnected 
                  ? "No pending bill requests to review"
                  : "Connect your wallet to view pending bill requests"}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-medium text-white">Pending Payments</p>
                {pendingBillsData.map((bill) => (
                  <div key={bill.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-sm font-medium">{bill.request}</p>
                        <p className="text-xs text-gray-400">From: {bill.beneficiary}</p>
                      </div>
                      <p className="font-medium">{bill.amount}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/20"
                        onClick={() => handleRejectBill(bill.id)}
                        disabled={!isConnected || !isCorrectNetwork || !isBillContractAvailable}
                      >
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-[#6544E4]/30 text-[#6544E4] hover:bg-[#6544E4]/20"
                        onClick={() => handleOpenPaymentDialog(bill, 'U2K')}
                        disabled={!isConnected || !isCorrectNetwork || !isTokenContractAvailable || !isBillContractAvailable}
                      >
                        Pay with U2K
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#6544E4] hover:bg-[#5335C5] text-white"
                        onClick={() => handleOpenPaymentDialog(bill, 'ETH')}
                        disabled={!isConnected || !isCorrectNetwork || !isBillContractAvailable}
                      >
                        <Check className="h-4 w-4 mr-1" /> Pay with ETH
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bills History Section */}
      <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Bill Payment History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-9 bg-gray-800 border-gray-700 text-white h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Filter className="h-4 w-4 mr-1" /> Filter by
              </Button>
              <Button variant="ghost" size="sm" className="text-[#6544E4]">
                View all
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Request
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Beneficiary
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Processed
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedBillsData.length > 0 ? (
                  processedBillsData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800">
                      <td className="py-4 text-sm">{item.id}</td>
                      <td className="py-4 text-sm">{item.request}</td>
                      <td className="py-4 text-sm">{item.beneficiary}</td>
                      <td className="py-4 text-sm">{item.amount}</td>
                      <td className="py-4 text-sm">
                        <span className={`px-2 py-1 ${item.statusColor} rounded-md text-xs`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm">{item.created}</td>
                      <td className="py-4 text-sm">{item.processed}</td>
                      <td className="py-4 text-sm">
                        <Button
                          variant="link"
                          className="text-[#6544E4] p-0 h-auto"
                        >
                          View details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-400">
                      {isConnected 
                        ? "No processed bills found."
                        : "Connect your wallet to view bill payment history"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1A1F2C] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Payment</DialogTitle>
            <DialogDescription className="text-gray-400">
              You are about to pay the following bill with {paymentType}
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="py-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Description:</span>
                  <span>{selectedBill.request}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Beneficiary:</span>
                  <span>{selectedBill.beneficiary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="font-medium">{selectedBill.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment method:</span>
                  <span>{paymentType}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentDialogOpen(false)}
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPayment}
              className="bg-[#6544E4] hover:bg-[#5335C5] text-white"
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletAndToken;
