
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { FormValues } from "@/types/bundle";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useBills } from "@/hooks/useBills";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BillsListProps {
  bills: FormValues[];
  onRemoveBill: (index: number) => void;
}

export default function BillsList({ bills, onRemoveBill }: BillsListProps) {
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<{ index: number, id?: string } | null>(null);
  
  const { deleteBill, refetch, isDeleting } = useBills();

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

  const promptDeleteBill = (index: number) => {
    const bill = bills[index];
    console.log(`Prompting to delete bill at index ${index}:`, bill);
    
    if (bill.id) {
      console.log(`Bill has ID: ${bill.id}`);
    } else {
      console.log(`Bill at index ${index} has no ID`);
    }
    
    setBillToDelete({ index, id: bill.id });
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!billToDelete) return;
    
    const { index, id } = billToDelete;
    setDeletingIndex(index);
    setConfirmDialogOpen(false);

    try {
      if (id) {
        console.log(`Attempting to delete bill with ID: ${id}`);
        // Direct call to deleteBill without using the callback syntax
        await deleteBill(id);
        console.log(`Bill ${id} deletion API call completed`);
        onRemoveBill(index);
        refetch(); // Explicitly refetch data
      } else {
        // If no ID, it's not saved on the server yet, just remove locally
        console.log("No ID found for bill, removing locally only");
        onRemoveBill(index);
      }
    } catch (err) {
      console.error("Error in bill deletion process:", err);
      toast.error("Failed to delete bill. Please try again.");
    } finally {
      setDeletingIndex(null);
      setBillToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setBillToDelete(null);
  };

  return (
    <div className="mt-4 mb-6">
      <h3 className="text-sm font-medium mb-2">Bills added to bundle ({bills.length})</h3>
      <div className="space-y-3">
        {bills.map((bill, index) => (
          <div key={index} className="flex flex-col p-3 bg-[#F1EDFF] rounded-md relative">
            {deletingIndex === index && (
              <div className="absolute inset-0 bg-white/70 rounded-md z-10 flex items-center justify-center">
                <Skeleton className="w-full h-full absolute inset-0 bg-white/70 rounded-md" />
                <Loader2 className="h-6 w-6 text-[#6544E4] animate-spin z-20" />
              </div>
            )}
            
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
                  {bill.id && <span className="text-xs text-blue-500">ID: {bill.id.substring(0, 8)}...</span>}
                </div>
                {bill.notes && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{bill.notes}</p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => promptDeleteBill(index)}
                className="h-8 w-8 p-0 rounded-full"
                disabled={deletingIndex === index}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
