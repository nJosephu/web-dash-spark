import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  CircleDollarSign,
  Filter,
  Plus,
  Search,
  Wallet,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Web3Wallet = () => {
  const { user } = useAuth();
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Mock data - this would be replaced with real blockchain data
  const statsData = [
    {
      title: "Total bills Requested",
      value: "0.070951 ETH",
      increase: "16%",
      increaseText: "Increase this month",
      color: "bg-green-500",
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
    {
      title: "Approved Bill Requests",
      value: "0.006329 ETH",
      increase: "16%",
      increaseText: "Increase this month",
      color: "bg-purple-500",
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
    {
      title: "Rejected Bill Requests",
      value: "0.000011 ETH",
      increase: "16%",
      increaseText: "Increase this month",
      color: "bg-red-500",
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
    {
      title: "Pending Bill Requests",
      value: "0.000172 ETH",
      increase: "16%",
      increaseText: "Increase this month",
      color: "bg-yellow-500",
      icon: <CircleDollarSign className="h-4 w-4" />,
    },
  ];

  const requestHistoryData = [
    {
      id: "1",
      request: "DSTV, Power bills",
      sponsor: "Father",
      status: "Completed",
      priority: "High",
      created: "Mar 21, 2025",
      dueDate: "Apr 13, 2025",
    },
  ];

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const connectWallet = () => {
    // This would integrate with an actual wallet like MetaMask
    setIsWalletConnected(true);
  };

  return (
    <div className="py-6">
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

      {/* Wallet and Request Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Wallet Section */}
        <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Wallet</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Plus className="h-4 w-4 mr-1" /> New wallet
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">My balance</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold mr-2">
                  {balanceVisible ? "$24,563.00" : "••••••••"}
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
                You earned ETH USD balance this month
              </p>
            </div>

            {/* Chart - placeholder for now */}
            <div className="h-32 w-full relative">
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
          </CardContent>
        </Card>

        {/* Create Request Section */}
        <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Create a new bill request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-6">
              Bundle your expenses into one smart request and send it directly
              to your sponsor. Funds go straight to the service providers,
              secure, transparent, and hassle-free.
            </p>
            <div className="space-y-4">
              <Button className="w-full py-6 bg-[#6544E4] hover:bg-[#5335C5] text-white">
                Create an URGENT 2KAY Request
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 bg-transparent border-gray-700 text-white hover:bg-gray-800"
              >
                See Previous Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request History Section */}
      <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Bill request history</CardTitle>
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
                    S/N
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Request
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sponsor
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Request status
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Due date
                  </th>
                  <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {requestHistoryData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="py-4 text-sm">{item.id}</td>
                    <td className="py-4 text-sm">{item.request}</td>
                    <td className="py-4 text-sm">{item.sponsor}</td>
                    <td className="py-4 text-sm">
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-xs">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-md text-xs">
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{item.created}</td>
                    <td className="py-4 text-sm">{item.dueDate}</td>
                    <td className="py-4 text-sm">
                      <Button
                        variant="link"
                        className="text-[#6544E4] p-0 h-auto"
                      >
                        View more info
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Web3Wallet;
