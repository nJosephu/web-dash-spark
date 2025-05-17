
import { CircleDollarSign, CirclePlus, Medal, PenSquare } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const SponsorStats = () => {
  const { web3State } = useWeb3();

  // These would be fetched from the blockchain in a real implementation
  const statData = [
    {
      title: "Requests Funded",
      value: "15",
      icon: <PenSquare size={18} />
    },
    {
      title: "Beneficiaries Supported",
      value: "8",
      icon: <CircleDollarSign size={18} />
    },
    {
      title: "Tokens Earned",
      value: "1,205",
      icon: <CirclePlus size={18} />
    },
    {
      title: "Support Tier",
      value: "Gold",
      icon: <Medal size={18} />
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon }: StatCardProps) => {
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
