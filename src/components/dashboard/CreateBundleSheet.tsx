
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormValues, CreateBundleSheetProps } from "@/types/bundle";
import BillsList from "./bundle/BillsList";
import BundleForm from "./bundle/BundleForm";
import { useSponsorData } from "./bundle/useSponsorData";
import { toast } from "@/components/ui/sonner";

export default function CreateBundleSheet({ trigger }: CreateBundleSheetProps) {
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState<FormValues[]>([]);
  const sponsors = useSponsorData();

  function onSubmit(data: FormValues) {
    setBills([...bills, data]);
    
    // For now, we'll just log the bills
    console.log("Bills for bundle:", [...bills, data]);
    
    // In a real application, you would submit the bundle to an API
    // and provide user feedback
    toast.success("Bundle created successfully!");
    setOpen(false);
  }

  function handleAddAnotherBill(data: FormValues) {
    setBills([...bills, data]);
    toast.success("Bill added to bundle");
  }

  function handleSaveToDraft() {
    console.log("Saved to draft");
    toast.success("Bundle saved to draft");
    setOpen(false);
  }

  function handleRemoveBill(index: number) {
    setBills(bills.filter((_, i) => i !== index));
    toast.success("Bill removed from bundle");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || <Button className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white">Create new bundle</Button>}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Create New Bundle</SheetTitle>
        </SheetHeader>
        
        <BillsList bills={bills} onRemoveBill={handleRemoveBill} />
        
        <BundleForm 
          sponsors={sponsors}
          onSubmit={onSubmit}
          onAddAnotherBill={handleAddAnotherBill}
          onSaveToDraft={handleSaveToDraft}
        />
      </SheetContent>
    </Sheet>
  );
}
