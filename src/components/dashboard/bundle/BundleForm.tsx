import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSchema, FormValues } from "@/types/bundle";
import { Sponsor } from "@/types/sponsor";
import { toast } from "@/components/ui/sonner";
import { Provider } from "@/services/providersService";
import { createBill } from "@/services/billService";

interface BundleFormProps {
  sponsors: Sponsor[];
  providers: Provider[];
  providersLoading: boolean;
  onSubmit: (data: FormValues) => void;
  onAddAnotherBill: (data: FormValues, billId: string) => void;
  selectedSponsorId?: string;
}

export default function BundleForm({
  sponsors,
  providers,
  providersLoading,
  onSubmit,
  onAddAnotherBill,
  selectedSponsorId,
}: BundleFormProps) {
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    priority: "medium",
    notes: "",
    ...(selectedSponsorId ? { sponsor: selectedSponsorId } : {}),
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the sponsor field when selectedSponsorId changes
  useEffect(() => {
    if (selectedSponsorId) {
      form.setValue("sponsor", selectedSponsorId);
    }
  }, [selectedSponsorId, form]);

  // Handle form submission and reset form
  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      // Create the bill using the API
      const billData = {
        billName: data.billName,
        type: data.billType,
        amount: parseFloat(data.amount),
        note: data.notes || undefined,
        dueDate: data.dueDate.toISOString(),
        priority: data.priority.toUpperCase() as "HIGH" | "MEDIUM" | "LOW",
        providerId: data.serviceProvider,
      };

      const response = await createBill(billData);
      console.log("Bill created with ID:", response.bill.id);

      // Find provider name for display
      const providerName =
        providers.find((p) => p.id === data.serviceProvider)?.name ||
        data.serviceProvider;

      // Add ID to the form data
      const formDataWithId = {
        ...data,
        id: response.bill.id, // Store the ID from the API response
      };

      // Call the onSubmit callback with the form data and bill ID
      onSubmit(formDataWithId);

      // Reset form
      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create bill";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding another bill and reset form
  const handleAddAnotherBill = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      // Create the bill using the API
      const billData = {
        billName: data.billName,
        type: data.billType,
        amount: parseFloat(data.amount),
        note: data.notes || undefined,
        dueDate: data.dueDate.toISOString(),
        priority: data.priority.toUpperCase() as "HIGH" | "MEDIUM" | "LOW",
        providerId: data.serviceProvider,
      };

      const response = await createBill(billData);
      console.log("Bill created with ID:", response.bill.id);

      // Find provider name for display
      const providerName =
        providers.find((p) => p.id === data.serviceProvider)?.name ||
        data.serviceProvider;

      // Add ID to the form data before passing it up
      const formDataWithId = {
        ...data,
        id: response.bill.id, // Store the ID from the API response
      };

      // Call the onAddAnotherBill callback with the form data and bill ID
      onAddAnotherBill(formDataWithId, response.bill.id);

      // Reset form
      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create bill";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state, keeping only the sponsor if it's preselected
  const resetForm = () => {
    // Reset all fields to their initial values
    form.reset({
      ...defaultValues,
    });

    // Explicitly clear specific fields to ensure they reset properly
    form.setValue("billName", "");
    form.setValue("billType", undefined);
    form.setValue("serviceProvider", undefined);
    form.setValue("amount", "");
    form.setValue("dueDate", undefined);
    form.setValue("notes", "");
    form.setValue("priority", "medium");

    // Re-set the sponsor if there's a selected one
    if (selectedSponsorId) {
      form.setValue("sponsor", selectedSponsorId);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 mt-6"
      >
        <FormField
          control={form.control}
          name="billName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Bill Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter bill name" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Bill Type <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Utility">Utility</SelectItem>
                  <SelectItem value="Airtime">Airtime</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Service Provider <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={providersLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        providersLoading
                          ? "Loading providers..."
                          : "Select provider"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providersLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading providers...
                    </SelectItem>
                  ) : providers.length > 0 ? (
                    providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No providers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="sponsor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Sponsor <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!!selectedSponsorId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sponsor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sponsors.map((sponsor) => (
                    <SelectItem key={sponsor.id} value={sponsor.id.toString()}>
                      {sponsor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSponsorId && (
                <FormDescription className="text-xs text-muted-foreground">
                  Sponsor is pre-selected for this bundle
                </FormDescription>
              )}
              {!selectedSponsorId && (
                <FormDescription className="text-xs text-muted-foreground">
                  Select who will sponsor this bill
                </FormDescription>
              )}
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="amount"
          render={({ field: { onChange, value, ...restField } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Bill Amount (₦) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="0.00"
                  onChange={(e) => onChange(e.target.value)}
                  value={value || ""}
                  {...restField}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Due Date <span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Notes (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about this bill"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Priority <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="high"
                        className="border-[#6544E4]"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      High
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="medium"
                        className="border-[#6544E4]"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Medium
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        value="low"
                        className="border-[#6544E4]"
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Low
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSubmit(handleAddAnotherBill)}
            className="w-full outline outline-2 outline-[#6544e4] outline-offset-2 border-dashed border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add bill
          </Button>
        </div>

        {/* <div className="pt-4 mt-5 border-t">
          <Button
            type="submit"
            className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
          >
            Add Bill
          </Button>
        </div> */}
      </form>
    </Form>
  );
}
