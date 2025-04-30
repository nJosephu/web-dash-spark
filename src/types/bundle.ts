
import { z } from "zod";

// Form schema for bundle creation
export const FormSchema = z.object({
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

export type FormValues = z.infer<typeof FormSchema>;

// Sponsor data type
export interface Sponsor {
  id: number;
  name: string;
  avatar: string;
  sponsoredAmount: string;
  activeRequests: number;
  joinedDate: string;
  verified: boolean;
  rating: number;
}

// Props for the CreateBundleSheet component
export interface CreateBundleSheetProps {
  trigger?: React.ReactNode;
}
