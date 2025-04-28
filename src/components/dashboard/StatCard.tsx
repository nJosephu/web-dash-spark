
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  percentChange: number;
  color: "green" | "purple" | "red" | "yellow";
  increaseIsGood?: boolean;
}

const StatCard = ({ title, value, percentChange, color, increaseIsGood = true }: StatCardProps) => {
  const isPositive = percentChange >= 0;
  const showPositiveIndicator = (isPositive && increaseIsGood) || (!isPositive && !increaseIsGood);

  const getBackgroundColor = () => {
    switch (color) {
      case "green": return "bg-emerald-100";
      case "purple": return "bg-purple-100";
      case "red": return "bg-red-100";
      case "yellow": return "bg-yellow-100";
    }
  };

  const getTextColor = () => {
    switch (color) {
      case "green": return "text-emerald-600";
      case "purple": return "text-purple-600";
      case "red": return "text-red-600";
      case "yellow": return "text-yellow-600";
    }
  };

  const getDotColor = () => {
    switch (color) {
      case "green": return "bg-emerald-500";
      case "purple": return "bg-purple-500";
      case "red": return "bg-red-500";
      case "yellow": return "bg-yellow-500";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", getDotColor())}></div>
          <span className="text-sm text-gray-600">{title}</span>
        </div>
        <div 
          className={cn(
            "flex items-center text-xs rounded px-2 py-1",
            showPositiveIndicator ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}
        >
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{Math.abs(percentChange)}%</span>
        </div>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
};

export default StatCard;
