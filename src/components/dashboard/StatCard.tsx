
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
interface StatCardProps {
  title: string;
  value: string;
  percentChange: number;
  color: "green" | "purple" | "red" | "yellow";
  increaseIsGood?: boolean;
}
const StatCard = ({
  title,
  value,
  percentChange,
  color,
  increaseIsGood = true
}: StatCardProps) => {
  const isPositive = percentChange >= 0;
  const showPositiveIndicator = isPositive && increaseIsGood || !isPositive && !increaseIsGood;

  // Define dot colors for different card types
  const getDotColor = () => {
    switch (color) {
      case "green":
        return "bg-emerald-500";
      case "purple":
        return "bg-[#7B68EE]";
      case "red":
        return "bg-red-500";
      case "yellow":
        return "bg-yellow-500";
    }
  };
  return <div className="p-4 rounded-lg border border-gray-200">
      <div className="flex items-start gap-2">
        <div className={cn("w-3 h-3 rounded-full mt-1.5", getDotColor())}></div>
        <div className="flex-1">
          <span className="text-sm text-gray-600">{title}</span>
          <div className="text-xl font-bold mt-1">{value}</div>
          <div className="flex items-center gap-1 mt-1">
            <div className={cn("flex items-center text-xs font-medium", showPositiveIndicator ? "text-green-600" : "text-red-600")}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              <span>{Math.abs(percentChange)}%</span>
            </div>
            <span className="text-xs text-gray-500">Increase this month</span>
          </div>
        </div>
      </div>
    </div>;
};
export default StatCard;
