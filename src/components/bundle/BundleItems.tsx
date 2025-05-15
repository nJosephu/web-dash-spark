
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BundleItem {
  id?: string;
  name: string;
  amount: string;
  priority?: "high" | "medium" | "low";
  category?: string;
  duedates?: string;
}

interface BundleItemsProps {
  items: BundleItem[];
  onDeleteBill?: (billId: string) => void;
  isDeletingBill?: boolean;
}

const BundleItems: React.FC<BundleItemsProps> = ({ items, onDeleteBill, isDeletingBill }) => {
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
        {items.length === 0 ? (
          <p className="text-gray-500 text-center p-4">No bills associated with this request.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item, index) => (
              <div
                key={item.id || index}
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

                    <p className="font-medium">{item.name}</p>
                    {item.priority && (
                      <Badge
                        className={`${getPriorityColor(
                          item.priority
                        )} capitalize my-1 text-xs`}
                        variant="outline"
                      >
                        {item.priority}
                      </Badge>
                    )}
                    <p className="tracking-widest text-[10px] font-medium text-gray-500 uppercase mt-1">
                      due : {formatDate(item.duedates)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.amount}</span>
                  {onDeleteBill && item.id && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => onDeleteBill(item.id!)}
                      disabled={isDeletingBill}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BundleItems;
