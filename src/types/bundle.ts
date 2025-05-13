
import { ReactNode } from "react";

export interface CreateBundleSheetProps {
  trigger?: ReactNode;
}

export interface FormValues {
  id?: string;
  billName?: string;
  billType?: string;
  serviceProvider?: string;
  sponsor?: string;
  amount?: string;
  dueDate?: Date;
  notes?: string;
  priority?: "high" | "medium" | "low";
}
