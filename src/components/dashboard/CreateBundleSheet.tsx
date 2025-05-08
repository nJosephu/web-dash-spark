import { useState } from "react";
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
import { loader } from "lucide-react";

// Step enum to track the bundle creation process
enum BundleStep {
  SPONSOR_SELECTION = 0,
  ADD_BILLS = 1,
  SUMMARY = 2,
}

export default function CreateBundleSheet({ trigger }: CreateBundleSheetProps) {
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState<FormValues[]>([]);
  const [currentStep, setCurrentStep] = useState<BundleStep>(
    BundleStep.SPONSOR_SELECTION
  );
  const [selectedSponsorId, setSelectedSponsorId] = useState<string>("");
  const [bundleTitle, setBundleTitle] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const sponsors = useSponsorData();
  const { user } = useAuth();

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
    setBills([]);
    setCurrentStep(BundleStep.SPONSOR_SELECTION);
    setSelectedSponsorId("");
    setBundleTitle("");
    setBundleDescription("");
  }

  function handleSponsorSelect(sponsorId: string) {
    setSelectedSponsorId(sponsorId);
    setCurrentStep(BundleStep.ADD_BILLS);
  }

  function handleFormSubmit(data: FormValues) {
    // This function handles the form submission from BundleForm
    if (bills.length === 0) {
      // If no bills yet, add the first one and stay on the bills step
      handleAddAnotherBill(data);
    } else {
      // If there are already bills, add this one and move to summary
      handleAddAnotherBill(data);
      setCurrentStep(BundleStep.SUMMARY);
    }
  }

  async function handleFinalSubmit() {
    if (!selectedSponsor) {
      toast.error("No sponsor selected. Please select a sponsor first.");
      return;
    }

    // Show loading state
    setIsSendingEmail(true);

    // Bundle data for saving and email
    const bundleData = {
      title: bundleTitle,
      description: bundleDescription,
      sponsor: selectedSponsor,
      bills,
      totalAmount: `${totalAmount}`,
    };

    console.log("Bundle data:", bundleData);

    try {
      // Send email notifications
      const userEmail = user?.email || "";
      const userName = user?.name || "User";
      
      // Mock sponsor email (in a real app, this would come from the sponsor data)
      const sponsorEmail = "sponsor@example.com"; // This is a placeholder

      await sendBundleSummaryEmail(
        userEmail,
        userName,
        sponsorEmail,
        selectedSponsor.name,
        bundleTitle,
        bundleDescription,
        totalAmount,
        bills
      );

      toast.success("Bundle created and email notifications sent");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error during bundle submission:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to create bundle: ${errorMessage}`);
    } finally {
      setIsSendingEmail(false);
    }
  }

  function handleAddAnotherBill(data: FormValues) {
    setBills([...bills, data]);
    toast.success("Bill added to bundle");
    // Form reset is now handled by the BundleForm component itself
  }

  function handleRemoveBill(index: number) {
    setBills(bills.filter((_, i) => i !== index));
    toast.success("Bill removed from bundle");
  }

  function handleContinueToSummary() {
    if (bills.length === 0) {
      toast.error("Please add at least one bill to continue");
      return;
    }
    setCurrentStep(BundleStep.SUMMARY);
  }

  function handleBackToAddBills() {
    setCurrentStep(BundleStep.ADD_BILLS);
  }

  function handleBackToSponsorSelection() {
    setCurrentStep(BundleStep.SPONSOR_SELECTION);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white">
            Create new bundle
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            Create New Bundle
          </SheetTitle>
        </SheetHeader>

        {/* Step indicator */}
        <div className="flex justify-between my-4 text-sm">
          <div
            className={`flex flex-col items-center ${
              currentStep >= BundleStep.SPONSOR_SELECTION
                ? "text-[#6544E4] font-medium"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                currentStep >= BundleStep.SPONSOR_SELECTION
                  ? "bg-[#6544E4] text-white"
                  : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span>Select Sponsor</span>
          </div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= BundleStep.ADD_BILLS
                ? "text-[#6544E4] font-medium"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                currentStep >= BundleStep.ADD_BILLS
                  ? "bg-[#6544E4] text-white"
                  : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span>Add Bills</span>
          </div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= BundleStep.SUMMARY
                ? "text-[#6544E4] font-medium"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                currentStep >= BundleStep.SUMMARY
                  ? "bg-[#6544E4] text-white"
                  : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span>Summary</span>
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
              onClick={() => handleSponsorSelect(selectedSponsorId)}
              disabled={!selectedSponsorId || !bundleTitle}
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
                disabled={isSendingEmail}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 bg-[#6544E4] hover:bg-[#5A3DD0]"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <loader className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
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
