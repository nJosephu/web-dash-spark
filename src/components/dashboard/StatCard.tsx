import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  color: "green" | "purple" | "red" | "yellow";
  colortag?: "white" | "black";
}

const StatCard = ({
  title,
  value,
  color,
  colortag = "white",
}: StatCardProps) => {
  // Define dot colors for different card types
  const getDotColor = () => {
    switch (color) {
      case "green":
        return "bg-[#B9E54E]";
      case "purple":
        return "bg-[#7B68EE]";
      case "red":
        return "bg-red-500";
      case "yellow":
        return "bg-yellow-500";
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-white">
      <div className="flex items-start gap-2">
        <div
          className={cn(
            "w-[30px] h-[30px] flex justify-center items-center rounded-full mt-1.5",
            getDotColor()
          )}
        >
          <Tag className={`w-[16px] h-[16px] text-${colortag}`}></Tag>
        </div>
        <div className="flex-1">
          <span className="text-sm text-gray-600">{title}</span>
          <div className="text-xl font-medium mt-1">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
