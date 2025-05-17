import { useState } from "react";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useWeb3 } from "@/context/Web3Context";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { SponsorWalletOverview } from "@/components/sponsor/wallet/SponsorWalletOverview";
import { SponsorStats } from "@/components/sponsor/wallet/SponsorStats";

const WalletAndToken = () => {
  const { web3State } = useWeb3();
  const [supportProgress, setSupportProgress] = useState(65); // percentage progress to next tier
  const [supportNeeded, setSupportNeeded] = useState(3); // more supporters needed for next tier
  
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

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="container p-0">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Wallet & Token</h1>
        <p className="text-gray-500">Manage your crypto wallet and U2KAY tokens</p>
      </div>
      
      {/* Wallet Section */}
      {!web3State.isConnected ? (
        <div className="text-center mb-8 p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect your cryptocurrency wallet to view your balance and support requests
          </p>
          <WalletConnectButton centered variant="default" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-12 mb-8">
          <SponsorWalletOverview />
        </div>
      )}
      
      {/* Stats Cards Row */}
      <SponsorStats />
      
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
    </div>
  );
};

export default WalletAndToken;
