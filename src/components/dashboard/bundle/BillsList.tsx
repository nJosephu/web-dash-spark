
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormValues } from "@/types/bundle";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { deleteBill } from "@/services/billService";
import { toast } from "sonner";
import { useState } from "react";

interface BillsListProps {
  bills: FormValues[];
  onRemoveBill: (index: number) => void;
}

export default function BillsList({ bills, onRemoveBill }: BillsListProps) {
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  if (bills.length === 0) {
    return null;
  }

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRemoveBill = async (index: number) => {
    const bill = bills[index];
    
    // If bill has an ID, it exists on the server and needs to be deleted
    if (bill.id) {
      try {
        setDeletingIndex(index);
        await deleteBill(bill.id);
        toast.success("Bill deleted successfully");
        onRemoveBill(index);
      } catch (err) {
        console.error("Error deleting bill:", err);
        toast.error("Failed to delete bill. Please try again.");
      } finally {
        setDeletingIndex(null);
      }
    } else {
      // If no ID, it's not saved on the server yet, just remove locally
      onRemoveBill(index);
    }
  };

  return (
    <div className="mt-4 mb-6">
      <h3 className="text-sm font-medium mb-2">Bills added to bundle ({bills.length})</h3>
      <div className="space-y-3">
        {bills.map((bill, index) => (
          <div key={index} className="flex flex-col p-3 bg-[#F1EDFF] rounded-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{bill.billName}</span>
                  <Badge className={`text-xs ${getPriorityColor(bill.priority)}`}>
                    {bill.priority}
                  </Badge>
                </div>
                <div className="flex flex-col mt-1">
                  <span className="text-xs text-gray-500">{bill.billType} - {bill.serviceProvider}</span>
                  <span className="text-sm font-medium mt-1">₦{bill.amount}</span>
                  <span className="text-xs text-gray-500">Due: {format(bill.dueDate, 'PP')}</span>
                </div>
                {bill.notes && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{bill.notes}</p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveBill(index)}
                className="h-8 w-8 p-0 rounded-full"
                disabled={deletingIndex === index}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
