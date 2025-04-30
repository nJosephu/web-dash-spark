
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormValues } from "@/types/bundle";

interface BillsListProps {
  bills: FormValues[];
  onRemoveBill: (index: number) => void;
}

export default function BillsList({ bills, onRemoveBill }: BillsListProps) {
  if (bills.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-6">
      <h3 className="text-sm font-medium mb-2">Bills added to bundle ({bills.length})</h3>
      <div className="space-y-2">
        {bills.map((bill, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex flex-col">
              <span className="font-medium">{bill.billName}</span>
              <span className="text-xs text-muted-foreground">₦{bill.amount}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveBill(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
