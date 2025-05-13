
// Bundle types definitions
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
  status: "pending" | "approved" | "rejected" | "cancelled";
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

// Use the common Sponsor type from @/types/sponsor instead of redefining
export { Sponsor } from "@/types/sponsor";

export interface FormValues {
  billName?: string;
  billType?: string;
  serviceProvider?: string;
  sponsor?: string;
  amount?: string;
  dueDate?: Date;
  notes?: string;
  priority?: "high" | "medium" | "low";
}

export interface CreateBundleSheetProps {
  trigger?: React.ReactNode;
}

export interface FormSchema {
  // Schema definition if needed
}
