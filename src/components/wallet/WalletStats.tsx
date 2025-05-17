
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";

interface StatProps {
  title: string;
  value: string;
  increase: string;
  increaseText: string;
  color: string;
  icon: React.ReactNode;
}

export const WalletStats = () => {
  const { web3State } = useWeb3();

  // For now, using mock data - would be replaced with real blockchain data
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          increase={stat.increase}
          increaseText={stat.increaseText}
          color={stat.color}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, increase, increaseText, color, icon }: StatProps) => {
  return (
    <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-full ${color} mr-2`}>
              {icon}
            </div>
            <p className="text-xs text-gray-400">{title}</p>
          </div>
          <div className="flex items-center text-xs text-green-400">
            <span className="mr-1">{increase}</span>
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
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-gray-400">{increaseText}</p>
        </div>
      </CardContent>
    </Card>
  );
};
