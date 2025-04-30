import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

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
import { FormSchema, FormValues, Sponsor } from "@/types/bundle";

interface BundleFormProps {
  sponsors: Sponsor[];
  onSubmit: (data: FormValues) => void;
  onAddAnotherBill: (data: FormValues) => void;
  onSaveToDraft: () => void;
}

export default function BundleForm({
  sponsors,
  onSubmit,
  onAddAnotherBill,
  onSaveToDraft,
}: BundleFormProps) {
  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    priority: "medium",
    notes: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  return (
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
                      {sponsor.name}
                    </SelectItem>
                  ))}
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
            onClick={form.handleSubmit(onAddAnotherBill)}
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
            onClick={onSaveToDraft}
          >
            Save to draft
          </Button>
          <Button type="submit" className="bg-[#6544E4] hover:bg-[#5A3DD0]">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
