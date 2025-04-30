
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Define the form schema with Zod
const FormSchema = z.object({
  billName: z.string().min(2, {
    message: "Bill name must be at least 2 characters.",
  }),
  billType: z.string({
    required_error: "Please select a bill type.",
  }),
  serviceProvider: z.string({
    required_error: "Please select a service provider.",
  }),
  sponsor: z.string({
    required_error: "Please select a sponsor.",
  }),
  amount: z.string().min(1, {
    message: "Please enter a valid amount.",
  }),
  dueDate: z.date({
    required_error: "Please select a due date.",
  }),
  notes: z.string().optional(),
  priority: z.enum(["high", "medium", "low"], {
    required_error: "Please select a priority level.",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

interface CreateBundleSheetProps {
  trigger?: React.ReactNode;
}

// Sponsor data type
interface Sponsor {
  id: number;
  name: string;
  avatar: string;
  sponsoredAmount: string;
  activeRequests: number;
  joinedDate: string;
  verified: boolean;
  rating: number;
}

export default function CreateBundleSheet({ trigger }: CreateBundleSheetProps) {
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState<FormValues[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  // Fetch sponsor data (in a real app this would come from an API)
  useEffect(() => {
    // Using the sponsorsData from Sponsors.tsx
    const sponsorsData = [
      {
        id: 1,
        name: "John Doe",
        avatar: "JD",
        sponsoredAmount: "₦350,000",
        activeRequests: 2,
        joinedDate: "Jan 2025",
        verified: true,
        rating: 4.8,
      },
      {
        id: 2,
        name: "Sarah Williams",
        avatar: "SW",
        sponsoredAmount: "₦280,000",
        activeRequests: 1,
        joinedDate: "Feb 2025",
        verified: true,
        rating: 4.9,
      },
      {
        id: 3,
        name: "Michael Brown",
        avatar: "MB",
        sponsoredAmount: "₦420,000",
        activeRequests: 3,
        joinedDate: "Dec 2024",
        verified: true,
        rating: 4.7,
      },
      {
        id: 4,
        name: "Lisa Johnson",
        avatar: "LJ",
        sponsoredAmount: "₦175,000",
        activeRequests: 1,
        joinedDate: "Mar 2025",
        verified: false,
        rating: 4.6,
      },
    ];
    
    setSponsors(sponsorsData);
  }, []);

  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    priority: "medium",
    notes: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  function onSubmit(data: FormValues) {
    setBills([...bills, data]);
    form.reset(defaultValues);
    
    // For now, we'll just log the bills
    console.log("Bills for bundle:", [...bills, data]);
    
    // In a real application, you would submit the bundle to an API
    // and provide user feedback
    setOpen(false);
  }

  function handleAddAnotherBill(data: FormValues) {
    setBills([...bills, data]);
    form.reset(defaultValues);
  }

  function handleSaveToDraft() {
    console.log("Saved to draft");
    setOpen(false);
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
        
        {bills.length > 0 && (
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
                    onClick={() => setBills(bills.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="debt">Debt</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dstv">DSTV</SelectItem>
                      <SelectItem value="nepa">NEPA</SelectItem>
                      <SelectItem value="mtn">MTN</SelectItem>
                      <SelectItem value="gotv">GOTV</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* New Sponsor dropdown field */}
            <FormField
              control={form.control}
              name="sponsor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Sponsor <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sponsor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sponsors.map((sponsor) => (
                        <SelectItem key={sponsor.id} value={sponsor.id.toString()}>
                          {sponsor.name} {sponsor.verified && "✓"}
                        </SelectItem>
                      ))}
                      <SelectItem value="none">No sponsor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-muted-foreground">
                    Select who will sponsor this bill
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Bill Amount (₦) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
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
                        disabled={(date) =>
                          date < new Date()
                        }
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
                  <FormLabel className="text-sm font-medium">Notes (Optional)</FormLabel>
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
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="high" className="border-[#6544E4]" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">High</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="medium" className="border-[#6544E4]" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Medium</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="low" className="border-[#6544E4]" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Low</FormLabel>
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
                className="w-full border-dashed border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                Add another bill
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 mt-5 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSaveToDraft}
              >
                Save to draft
              </Button>
              <Button type="submit" className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
