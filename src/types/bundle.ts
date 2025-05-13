
import { z } from "zod";
import { Sponsor } from "@/types/sponsor"; // Import the common Sponsor type

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

// Extend the form values type to include the id field
export interface FormValues extends z.infer<typeof FormSchema> {
  id?: string;  // Added id field to fix the TypeScript error
}

// Remove the duplicate Sponsor type - use the one from @/types/sponsor instead
// We re-export the type from sponsor.ts to maintain compatibility
export type { Sponsor };

// Props for the CreateBundleSheet component
export interface CreateBundleSheetProps {
  trigger?: React.ReactNode;
}

// API Response Types
export interface BillResponse {
  message: string;
  bill: {
    id: string;
    billName: string;
    type: string;
    note?: string;
    amount: number;
    priority: string;
    status: string;
    dueDate: string;
    userId: string;
    providerId: string;
    requestId: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface BundleResponse {
  message: string;
  request: {
    id: string;
    name: string;
    notes?: string;
    status: string;
    userId: string;
    supporterId: string;
    createdAt: string;
    updatedAt: string;
  };
}
