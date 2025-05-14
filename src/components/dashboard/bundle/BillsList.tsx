
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormValues } from "@/types/bundle";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useBills } from "@/hooks/useBills";
import { toast } from "sonner";
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
  
  const { deleteBill, refetch } = useBills();

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
        console.log(`Deleting bill with ID: ${id}`);
        // Use the React Query mutation with callback
        await new Promise<void>((resolve, reject) => {
          deleteBill(id, {
            onSuccess: () => {
              console.log(`Bill ${id} deleted successfully`);
              onRemoveBill(index);
              refetch(); // Explicitly refetch data
              resolve();
            },
            onError: (error) => {
              console.error(`Error deleting bill ${id}:`, error);
              reject(error);
            },
            onSettled: () => {
              setDeletingIndex(null);
              setBillToDelete(null);
            }
          });
        });
      } else {
        // If no ID, it's not saved on the server yet, just remove locally
        onRemoveBill(index);
        setDeletingIndex(null);
        setBillToDelete(null);
      }
    } catch (err) {
      console.error("Error in bill deletion process:", err);
      toast.error("Failed to delete bill. Please try again.");
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
