
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Bill } from "@/services/requestService";
import { useBillOperations } from "@/hooks/useBillOperations";
import { Loader } from "lucide-react";

interface BundleItem {
  name: string;
  amount: string;
  priority?: "high" | "medium" | "low";
  category?: string;
  duedates?: string;
  id?: string;
}

interface BundleItemsProps {
  items: BundleItem[];
  showDeleteButton?: boolean;
}

const BundleItems: React.FC<BundleItemsProps> = ({ items, showDeleteButton = false }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const { deleteBill, isDeleting } = useBillOperations();
  
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

  const handleDeleteClick = (billId?: string) => {
    if (!billId) return;
    setSelectedBillId(billId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBillId) return;
    deleteBill(selectedBillId);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Bundle Items</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No bills associated with this request.</p>
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
                <div className="flex flex-col items-end gap-2">
                  <span className="font-medium">{item.amount}</span>
                  {showDeleteButton && item.id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default BundleItems;
