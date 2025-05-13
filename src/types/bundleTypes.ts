
// Combined bundle type definitions
import { z } from "zod";

// Bundle interface from bundle.d.ts
export interface BundleItem {
  name: string;
  amount: string;
  priority?: "high" | "medium" | "low";
  category?: string;
}

export interface ActivityLog {
  type: string;
  message: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  completed?: boolean;
}

export interface Bundle {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  sponsor: {
    name: string;
    avatar?: string;
    email?: string; // Added email field
  };
  priority?: "high" | "medium" | "low";
  description?: string;
  items: BundleItem[];
  activityLog: ActivityLog[];
}

// Form schema from bundle.ts
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

// Update FormValues to include id
export interface FormValues extends z.infer<typeof FormSchema> {
  id?: string;  // Added id field to fix the TypeScript error
}

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
  email: string; // Added email field
}

// Props for the CreateBundleSheet component
export interface CreateBundleSheetProps {
  trigger?: React.ReactNode;
}
