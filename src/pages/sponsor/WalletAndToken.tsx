
import { useState } from "react";
import { Wallet, ArrowRight, RefreshCw, Clock, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const WalletAndToken = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");
  
  // Mock data - would be replaced with actual wallet integration
  const walletAddress = "0x1a2b...3c4d";
  const ethBalance = "2.54";
  const tokenBalance = "1,205";
  const supportProgress = 65; // percentage progress to next tier
  
  const connectWallet = () => {
    // This would integrate with actual web3 wallet like MetaMask
    setIsWalletConnected(true);
  };

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

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="container p-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Wallet & Token</h1>
        <p className="text-gray-500">Manage your crypto wallet and U2KAY tokens</p>
      </div>
      
      {/* Wallet Section */}
      <div className="grid gap-6 md:grid-cols-12 mb-8">
        {/* Wallet Card - Left Column */}
        <Card className="md:col-span-7 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Wallet</CardTitle>
              {isWalletConnected && (
                <Button 
                  variant="outline" 
                  className="gap-2 text-xs"
                  onClick={() => setIsWalletConnected(false)}
                >
                  <RefreshCw size={14} />
                  Refresh
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isWalletConnected ? (
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
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Wallet Address</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">{walletAddress}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-500 mb-1 text-sm">ETH Balance</div>
                      <div className="font-semibold text-2xl">{ethBalance}</div>
                      <div className="text-gray-500 text-xs">≈ $5,080 USD</div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-500 mb-1 text-sm">U2KAY Tokens</div>
                      <div className="font-semibold text-2xl">{tokenBalance}</div>
                      <div className="text-gray-500 text-xs">Support rewards</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="bg-[#6544E4] hover:bg-[#5A3DD0] mt-2 w-full sm:w-auto"
                  >
                    Support Requests
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Stats Cards - Right Column */}
        <div className="md:col-span-5 grid gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm">Request Stats</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Received</div>
                  <div className="font-semibold">24</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Funded</div>
                  <div className="font-semibold">15</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm">Beneficiaries Supported</h3>
              </div>
              <div className="text-3xl font-semibold">8</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm">Tokens Earned</h3>
              </div>
              <div className="text-3xl font-semibold">1,205</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Support Tiers */}
      <Card className="mb-8 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Support Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">Gold Sponsor</span>
                <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">Current</Badge>
              </div>
              <span className="text-sm font-medium">65% to Platinum</span>
            </div>
            <Progress value={supportProgress} className="h-2 bg-gray-100" />
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
      
      {/* Transactions & Activity Tabs */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
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
            </TabsContent>
            
            <TabsContent value="activity">
              {mockActivity.length > 0 ? (
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-full bg-purple-100">
                          <Clock size={16} className="text-purple-600" />
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletAndToken;
