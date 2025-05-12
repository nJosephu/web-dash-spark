
import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FormValues, CreateBundleSheetProps, Sponsor } from "@/types/bundle";
import BillsList from "./bundle/BillsList";
import BundleForm from "./bundle/BundleForm";
import { useSponsorData } from "./bundle/useSponsorData";
import { toast } from "@/components/ui/sonner";
import BundleSummary from "@/components/bundle/BundleSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { sendBundleSummaryEmail } from "@/services/emailService";
import { Loader, Check } from "lucide-react";
import { useProviders } from "@/services/providersService";
import { createBundle } from "@/services/bundleService";

// Step enum to track the bundle creation process
enum BundleStep {
  SPONSOR_SELECTION = 0,
  ADD_BILLS = 1,
  SUMMARY = 2,
}

// Interface to store bill with its API ID
interface BillWithId {
  formData: FormValues;
  billId: string;
}

export default function CreateBundleSheet({ trigger }: CreateBundleSheetProps) {
  const [open, setOpen] = useState(false);
  const [billsWithIds, setBillsWithIds] = useState<BillWithId[]>([]);
  const [currentStep, setCurrentStep] = useState<BundleStep>(
    BundleStep.SPONSOR_SELECTION
  );
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>("");
  const [bundleTitle, setBundleTitle] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isCreatingBundle, setIsCreatingBundle] = useState(false);
  const sponsors = useSponsorData();
  const { providers, isLoading: providersLoading } = useProviders();
  const { user } = useAuth();
  // Add a ref for the sheet content to scroll to top
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the top of the sheet content
  const scrollToTop = () => {
    if (sheetContentRef.current) {
      sheetContentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Get bills for display (without IDs)
  const bills = billsWithIds.map(item => item.formData);

  // Get the selected sponsor object
  const selectedSponsor = sponsors.find(
    (sponsor) => sponsor.id.toString() === selectedSponsorId
  );

  // Calculate the total amount of all bills
  const totalAmount = bills
    .reduce((sum, bill) => {
      const amount = parseFloat(bill.amount) || 0;
      return sum + amount;
    }, 0)
    .toFixed(2);

  function resetForm() {
    setBillsWithIds([]);
    setCurrentStep(BundleStep.SPONSOR_SELECTION);
    setSelectedSponsorId("");
    setBundleTitle("");
    setBundleDescription("");
  }

  function handleSponsorSelect(sponsorId: string) {
    setSelectedSponsorId(sponsorId);
    // No longer auto-progressing to next step
  }

  function handleFormSubmit(data: FormValues) {
    // This function handles the form submission from BundleForm
    if (bills.length === 0) {
      // If no bills yet, add the first one and stay on the bills step
      handleAddAnotherBill(data, "");
    } else {
      // If there are already bills, add this one and move to summary
      handleAddAnotherBill(data, "");
      setCurrentStep(BundleStep.SUMMARY);
      // Scroll to the top when moving to summary
      scrollToTop();
    }
  }

  async function handleFinalSubmit() {
    if (!selectedSponsor) {
      toast.error("No sponsor selected. Please select a sponsor first.");
      return;
    }

    if (billsWithIds.length === 0) {
      toast.error("No bills added to bundle. Please add at least one bill.");
      return;
    }

    // Show loading state
    setIsCreatingBundle(true);
    setIsSendingEmail(true);

    try {
      // Extract bill IDs for bundle creation
      const billIds = billsWithIds.map(item => item.billId).filter(id => id !== "");
      
      if (billIds.length === 0) {
        toast.error("No valid bill IDs found. Please try adding bills again.");
        setIsCreatingBundle(false);
        setIsSendingEmail(false);
        return;
      }

      // Create the bundle using the API
      const bundleData = {
        name: bundleTitle,
        notes: bundleDescription || undefined,
        supporterId: selectedSponsorId,
        billIds: billIds,
      };

      console.log("Creating bundle with data:", bundleData);
      const response = await createBundle(bundleData);

      // Get sponsor email from the sponsor data
      const sponsorEmail = selectedSponsor.email || "";
      console.log(`Selected sponsor: ${selectedSponsor.name}, email: ${sponsorEmail}`);

      // Send email notification (if needed)
      if (sponsorEmail) {
        await sendBundleSummaryEmail(
          sponsorEmail,
          selectedSponsor.name,
          bundleTitle
        );
      }

      toast.success("Bundle created and notification sent to sponsor");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error during bundle submission:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to create bundle: ${errorMessage}`);
    } finally {
      setIsCreatingBundle(false);
      setIsSendingEmail(false);
    }
  }

  function handleAddAnotherBill(data: FormValues, billId: string) {
    setBillsWithIds([...billsWithIds, { formData: data, billId }]);
    toast.success("Bill added to bundle");
    // Scroll to the top after adding a bill
    scrollToTop();
    // Form reset is now handled by the BundleForm component itself
  }

  function handleRemoveBill(index: number) {
    setBillsWithIds(billsWithIds.filter((_, i) => i !== index));
    toast.success("Bill removed from bundle");
  }

  function handleContinueToAddBills() {
    // Add validation for bundle title
    if (!bundleTitle.trim()) {
      toast.error("Please enter a bundle title");
      return;
    }

    if (!selectedSponsorId) {
      toast.error("Please select a sponsor");
      return;
    }

    setCurrentStep(BundleStep.ADD_BILLS);
    // Scroll to the top when moving to add bills
    scrollToTop();
  }

  function handleContinueToSummary() {
    if (bills.length === 0) {
      toast.error("Please add at least one bill to continue");
      return;
    }
    setCurrentStep(BundleStep.SUMMARY);
    // Scroll to the top when moving to summary
    scrollToTop();
  }

  function handleBackToAddBills() {
    setCurrentStep(BundleStep.ADD_BILLS);
    // Scroll to the top when going back to add bills
    scrollToTop();
  }

  function handleBackToSponsorSelection() {
    setCurrentStep(BundleStep.SPONSOR_SELECTION);
    // Scroll to the top when going back to sponsor selection
    scrollToTop();
  }

  // Define the steps of the bundle creation process
  const steps = [
    { id: 0, name: "Select Sponsor" },
    { id: 1, name: "Add Bills" },
    { id: 2, name: "Summary" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white">
            Create new bundle
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto" ref={sheetContentRef}>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            Create New Bundle
          </SheetTitle>
        </SheetHeader>

        {/* Enhanced progress indicator with connecting lines */}
        <div className="my-6">
          <div className="relative flex justify-between items-center">
            {/* Connecting lines */}
            <div className="absolute h-1 bg-gray-200 top-[35%] left-[10%] right-[6%] -translate-y-[35%] z-0"></div>

            {/* Steps with circles */}
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col gap-1 items-center z-10 relative"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id
                      ? "bg-[#6544E4] text-white"
                      : currentStep === step.id
                      ? "bg-[#6544E4] text-white border-4 border-[#F1EDFF]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    currentStep >= step.id
                      ? "text-[#6544E4] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {currentStep === BundleStep.SPONSOR_SELECTION && (
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <Label htmlFor="bundleTitle">
                Bundle Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bundleTitle"
                value={bundleTitle}
                onChange={(e) => setBundleTitle(e.target.value)}
                placeholder="Enter a name for this bundle"
                required
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="bundleDescription">
                Bundle Description (Optional)
              </Label>
              <Input
                id="bundleDescription"
                value={bundleDescription}
                onChange={(e) => setBundleDescription(e.target.value)}
                placeholder="Add a description for this bundle"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="sponsor">
                Select Sponsor <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={handleSponsorSelect}
                value={selectedSponsorId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sponsor for this bundle" />
                </SelectTrigger>
                <SelectContent>
                  {sponsors.map((sponsor) => (
                    <SelectItem key={sponsor.id} value={sponsor.id.toString()}>
                      {sponsor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This sponsor will be responsible for all bills in this bundle
              </p>
            </div>

            <Button
              onClick={handleContinueToAddBills}
              disabled={!selectedSponsorId || !bundleTitle.trim()}
              className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
            >
              Continue
            </Button>
          </div>
        )}

        {currentStep === BundleStep.ADD_BILLS && (
          <>
            {selectedSponsor && (
              <div className="mb-4 p-3 bg-[#F1EDFF] rounded-md">
                <p className="text-sm font-medium">Bundle Sponsor:</p>
                <p className="text-[#6544E4] font-semibold">
                  {selectedSponsor.name}
                </p>
              </div>
            )}

            <BillsList bills={bills} onRemoveBill={handleRemoveBill} />

            <BundleForm
              sponsors={sponsors}
              providers={providers}
              providersLoading={providersLoading}
              selectedSponsorId={selectedSponsorId}
              onSubmit={handleFormSubmit}
              onAddAnotherBill={handleAddAnotherBill}
            />

            <div className="pt-4 mt-5 border-t flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToSponsorSelection}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleContinueToSummary}
                disabled={bills.length === 0}
                className="flex-1 bg-[#6544E4] hover:bg-[#5A3DD0]"
              >
                Review Bundle
              </Button>
            </div>
          </>
        )}

        {currentStep === BundleStep.SUMMARY && (
          <div className="mt-6">
            <div className="mb-6 space-y-4">
              <div>
                <h3 className="font-medium text-lg">{bundleTitle}</h3>
                {bundleDescription && (
                  <p className="text-sm text-gray-500">{bundleDescription}</p>
                )}
              </div>

              <BundleSummary
                description={bundleDescription || "No description provided."}
                sponsor={selectedSponsor || { name: "No sponsor selected" }}
                amount={`₦${totalAmount}`}
              />

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  Bills in this bundle ({bills.length})
                </h3>
                <BillsList bills={bills} onRemoveBill={handleRemoveBill} />
              </div>
            </div>

            <div className="pt-4 mt-5 border-t flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToAddBills}
                className="flex-1"
                disabled={isCreatingBundle || isSendingEmail}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 bg-[#6544E4] hover:bg-[#5A3DD0]"
                disabled={isCreatingBundle || isSendingEmail}
              >
                {isCreatingBundle ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Creating Bundle...
                  </>
                ) : isSendingEmail ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending Notification...
                  </>
                ) : (
                  "Submit Bundle"
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
