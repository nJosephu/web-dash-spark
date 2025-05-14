import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { format, parseISO } from "date-fns";

interface BundleItem {
  name: string;
  amount: string;
  priority?: "high" | "medium" | "low";
  category?: string;
  duedates?: string;
}

interface BundleItemsProps {
  items: BundleItem[];
}

const BundleItems: React.FC<BundleItemsProps> = ({ items }) => {
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Bundle Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#6544E4]/10 p-2 rounded">
                  <Package className="h-5 w-5 text-[#6544E4]" />
                </div>
                <div>
                  <p className="tracking-widest text-xs font-regular text-gray-500 uppercase">
                    {item.category}
                  </p>
                  <p className="tracking-widest text-xs font-regular text-gray-500 uppercase mt-1">
                    due date : {formatDate(item.duedates)}
                  </p>
                  <p className="font-medium">{item.name}</p>
                  {item.priority && (
                    <Badge
                      className={`${getPriorityColor(
                        item.priority
                      )} capitalize mt-1 text-xs`}
                      variant="outline"
                    >
                      {item.priority}
                    </Badge>
                  )}
                </div>
              </div>
              <span className="font-medium">{item.amount}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleItems;
