
import { useState } from "react";
import { Wallet, ArrowRight, RefreshCw, Clock, ChevronRight, ExternalLink, Medal, CircleDollarSign, PenSquare, CirclePlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useWeb3 } from "@/context/Web3Context";
import { useBlockchainBills } from "@/hooks/useBlockchainBills";
import { ethers } from "ethers";
import { NETWORK, shortenAddress, formatEthAmount, BillStatus } from "@/config/blockchain";

const WalletAndToken = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const { user } = useAuth();
  const { 
    isConnected, 
    isConnecting, 
    address, 
    ethBalance, 
    u2kBalance, 
    connectWallet,
    isCorrectNetwork,
    switchNetwork,
    refreshBalances
  } = useWeb3();
  
  const { bills, payBillWithNative, rejectBill, isLoading: isLoadingBills } = useBlockchainBills();
  
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<{
    id: string;
    amount: string;
    description: string;
    beneficiary: string;
  } | null>(null);
  
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  // Support tier data - in a real app this would come from the API
  const supportProgress = 65; // percentage progress to next tier
  const supportNeeded = 3; // more supporters needed for next tier
  
  // Mock data for transactions and activity - would be replaced with blockchain data
  const mockTransactions = [
    {
      id: "tx1",
      type: "Sent",
      amount: "0.5 ETH",
      recipient: "0xabcd...1234",
      date: new Date(2025, 4, 10),
      status: "Completed"
    },
    {
      id: "tx2",
      type: "Received",
      amount: "120 U2KAY",
      sender: "Urgent2Kay",
      date: new Date(2025, 4, 8),
      status: "Completed"
    },
    {
      id: "tx3",
      type: "Sent",
      amount: "0.25 ETH",
      recipient: "0xefgh...5678",
      date: new Date(2025, 4, 5),
      status: "Completed"
    }
  ];

  const mockActivity = [
    {
      id: "act1",
      action: "Funded Request",
      description: "School Fees Support",
      date: new Date(2025, 4, 12),
      amount: "0.75 ETH",
      reward: "+50 U2KAY"
    },
    {
      id: "act2",
      action: "Received Tokens",
      description: "Support Reward",
      date: new Date(2025, 4, 8),
      amount: "120 U2KAY"
    },
    {
      id: "act3",
      action: "Funded Request",
      description: "Medical Bill Support",
      date: new Date(2025, 4, 2),
      amount: "0.5 ETH",
      reward: "+30 U2KAY"
    }
  ];

  // Calculate sponsor metrics based on blockchain bills
  const calculateMetrics = () => {
    const billsArray = bills.address || [];
    
    const requestsFunded = billsArray.filter(bill => bill.status === BillStatus.Paid).length;
    
    const beneficiariesSupported = new Set(
      billsArray
        .filter(bill => bill.status === BillStatus.Paid)
        .map(bill => bill.beneficiary)
    ).size;
    
    const tokensEarned = u2kBalance || "0";
    
    // Determine support tier based on beneficiaries supported
    let supportTier = "Bronze";
    if (beneficiariesSupported >= 10) {
      supportTier = "Platinum";
    } else if (beneficiariesSupported >= 5) {
      supportTier = "Gold";
    } else if (beneficiariesSupported >= 3) {
      supportTier = "Silver";
    }
    
    return [
      {
        title: "Requests Funded",
        value: requestsFunded.toString(),
        icon: <PenSquare size={18} />
      },
      {
        title: "Beneficiaries Supported",
        value: beneficiariesSupported.toString(),
        icon: <CircleDollarSign size={18} />
      },
      {
        title: "Tokens Earned",
        value: parseFloat(tokensEarned).toFixed(2),
        icon: <CirclePlus size={18} />
      },
      {
        title: "Support Tier",
        value: supportTier,
        icon: <Medal size={18} />
      }
    ];
  };

  const metricsData = calculateMetrics();

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  const handlePayBill = async () => {
    if (!selectedBillForPayment) return;
    
    try {
      await payBillWithNative({
        billId: selectedBillForPayment.id,
        amount: paymentAmount
      });
      setIsPayDialogOpen(false);
      setSelectedBillForPayment(null);
      setPaymentAmount("");
      refreshBalances();
    } catch (error: any) {
      toast.error(`Failed to pay bill: ${error.message}`);
    }
  };

  const handleRejectBill = async () => {
    if (!selectedBillForPayment) return;
    
    try {
      await rejectBill(selectedBillForPayment.id);
      setIsRejectDialogOpen(false);
      setSelectedBillForPayment(null);
    } catch (error: any) {
      toast.error(`Failed to reject bill: ${error.message}`);
    }
  };

  return (
    <div className="container p-0">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Wallet & Token</h1>
        <p className="text-gray-500">Manage your crypto wallet and U2KAY tokens</p>
      </div>
      
      {/* Wallet Section */}
      <div className="grid gap-6 md:grid-cols-12 mb-8">
        {/* Wallet Card - Left Column */}
        <Card className="md:col-span-12 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Wallet</CardTitle>
              {isConnected && (
                <Button 
                  variant="outline" 
                  className="gap-2 text-xs"
                  onClick={refreshBalances}
                >
                  <RefreshCw size={14} />
                  Refresh
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Wallet size={32} className="text-gray-500" />
                </div>
                <h3 className="font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-gray-500 text-sm text-center mb-6 max-w-md">
                  Connect your crypto wallet to view your balance and support requests
                </p>
                <Button 
                  className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  onClick={connectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500">Wallet Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{shortenAddress(address || '')}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => {
                      window.open(`${NETWORK.blockExplorerUrl}/address/${address}`, '_blank');
                    }}>
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
                
                {!isCorrectNetwork && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Wrong Network</p>
                      <p className="text-sm">Please connect to Base Sepolia Testnet</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-auto bg-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-200"
                      onClick={switchNetwork}
                    >
                      Switch Network
                    </Button>
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* ETH Balance */}
                  <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="p-3 rounded-full bg-[#6544E4]/20">
                        <CircleDollarSign size={20} className="text-[#6544E4]" />
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm mb-1">ETH Balance</div>
                        <div className="font-semibold text-2xl">{ethBalance || "0.00"}</div>
                        <div className="text-gray-500 text-xs">Base Sepolia Testnet</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* U2KAY Tokens */}
                  <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="p-3 rounded-full bg-[#6544E4]/20">
                        <CirclePlus size={20} className="text-[#6544E4]" />
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm mb-1">U2KAY Tokens</div>
                        <div className="font-semibold text-2xl">{u2kBalance || "0.00"}</div>
                        <div className="text-gray-500 text-xs">Support rewards</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Support Requests Button */}
                  <div className="flex items-center justify-center">
                    <Button 
                      className="bg-[#6544E4] hover:bg-[#5A3DD0] w-full h-14 text-base"
                      disabled={!isConnected || !isCorrectNetwork}
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
      </div>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metricsData.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title} 
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Support Tiers */}
      <Card className="mb-8 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Support Rewards</CardTitle>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Current: Gold</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Medal className="text-[#6544E4] mr-2" size={18} />
                <span className="font-medium text-sm">{supportNeeded} more supports to reach Platinum</span>
              </div>
              <span className="text-sm font-medium text-[#6544E4]">{supportProgress}%</span>
            </div>
            <Progress value={supportProgress} className="h-2 bg-gray-100" indicatorClassName="bg-[#6544E4]" />
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Silver</Badge>
                <span className="text-xs font-medium">500 U2KAY</span>
              </div>
              <div className="text-sm text-gray-500">Support 3+ beneficiaries</div>
            </div>
            
            <div className="border border-[#6544E4] rounded-lg p-3 bg-purple-50">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Gold</Badge>
                <span className="text-xs font-medium">1,000 U2KAY</span>
              </div>
              <div className="text-sm text-gray-500">Support 5+ beneficiaries</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Platinum</Badge>
                <span className="text-xs font-medium">2,000 U2KAY</span>
              </div>
              <div className="text-sm text-gray-500">Support 10+ beneficiaries</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bill Requests Section */}
      <Card className="bg-white shadow-sm mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Pending Bill Requests</CardTitle>
            <Button variant="ghost" className="text-[#6544E4] p-0 h-auto hover:bg-transparent hover:text-[#5A3DD0]">
              See all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-10 text-gray-500">
              Connect your wallet to view pending bill requests
            </div>
          ) : bills.address && bills.address.filter(bill => bill.status === BillStatus.Pending).length > 0 ? (
            <div className="space-y-4">
              {bills.address
                .filter(bill => bill.status === BillStatus.Pending)
                .map((bill) => (
                  <div key={bill.id.toString()} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-[#6544E4]/10">
                        <CircleDollarSign size={18} className="text-[#6544E4]" />
                      </div>
                      <div>
                        <div className="font-medium">{bill.description || `Bill Request #${bill.id}`}</div>
                        <div className="text-sm text-gray-500">From: {shortenAddress(bill.beneficiary)}</div>
                        <div className="text-sm font-medium text-[#6544E4]">
                          {formatEthAmount(ethers.utils.formatEther(bill.amount))} ETH
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                        onClick={() => {
                          setSelectedBillForPayment({
                            id: bill.id.toString(),
                            amount: ethers.utils.formatEther(bill.amount),
                            description: bill.description || `Bill Request #${bill.id}`,
                            beneficiary: bill.beneficiary
                          });
                          setPaymentAmount(ethers.utils.formatEther(bill.amount));
                          setIsPayDialogOpen(true);
                        }}
                      >
                        Pay
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-[#6544E4] text-[#6544E4] hover:bg-[#6544E4]/10"
                        onClick={() => {
                          setSelectedBillForPayment({
                            id: bill.id.toString(),
                            amount: ethers.utils.formatEther(bill.amount),
                            description: bill.description || `Bill Request #${bill.id}`,
                            beneficiary: bill.beneficiary
                          });
                          setIsRejectDialogOpen(true);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No pending bill requests
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Activity Section */}
      <Card className="bg-white shadow-sm mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <Button variant="ghost" className="text-[#6544E4] p-0 h-auto hover:bg-transparent hover:text-[#5A3DD0]">
              See all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockActivity.length > 0 ? (
            <div className="space-y-4">
              {mockActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-full bg-[#6544E4]/10">
                      <Clock size={18} className="text-[#6544E4]" />
                    </div>
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-gray-500">{activity.description}</div>
                      {activity.reward && (
                        <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">{activity.reward}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatDate(activity.date)}</div>
                    <div className="text-xs font-medium">{activity.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No activity yet
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Transactions Section */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Transactions</CardTitle>
            <Button variant="ghost" className="text-[#6544E4] p-0 h-auto hover:bg-transparent hover:text-[#5A3DD0]">
              See all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockTransactions.length > 0 ? (
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${tx.type === "Sent" ? "bg-orange-100" : "bg-green-100"}`}>
                      <ArrowRight size={16} className={tx.type === "Sent" ? "text-orange-600 rotate-45" : "text-green-600 -rotate-45"} />
                    </div>
                    <div>
                      <div className="font-medium">{tx.type} {tx.amount}</div>
                      <div className="text-sm text-gray-500">
                        {tx.type === "Sent" ? `To: ${tx.recipient}` : `From: ${tx.sender}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatDate(tx.date)}</div>
                    <div className="text-xs text-gray-500">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No transactions yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pay Bill Dialog */}
      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pay Bill Request</DialogTitle>
            <DialogDescription>
              You're about to pay the following bill request:
            </DialogDescription>
          </DialogHeader>
          
          {selectedBillForPayment && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Description:</span>
                  <span className="col-span-3">{selectedBillForPayment.description}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Beneficiary:</span>
                  <span className="col-span-3">{shortenAddress(selectedBillForPayment.beneficiary)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Amount (ETH):</span>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full p-2 border rounded"
                      step="0.001"
                      min={0}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handlePayBill}
                  className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                >
                  Confirm Payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reject Bill Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Bill Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this bill request?
            </DialogDescription>
          </DialogHeader>
          
          {selectedBillForPayment && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Description:</span>
                  <span className="col-span-3">{selectedBillForPayment.description}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Beneficiary:</span>
                  <span className="col-span-3">{shortenAddress(selectedBillForPayment.beneficiary)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium">Amount:</span>
                  <span className="col-span-3">{selectedBillForPayment.amount} ETH</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectBill}
                >
                  Reject Bill
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// StatCard component for the stats section
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-full bg-[#6544E4]/10 mt-0.5">
          <div className="text-[#6544E4]">{icon}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">{title}</div>
          <div className="font-medium text-xl mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletAndToken;
