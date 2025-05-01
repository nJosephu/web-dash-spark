
// Extending the existing bundle.ts to include BundleDetails types
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
  };
  priority?: "high" | "medium" | "low";
  description?: string;
  items: BundleItem[];
  activityLog: ActivityLog[];
}
