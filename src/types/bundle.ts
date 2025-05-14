
import { z } from "zod";
import { Sponsor } from "./sponsor";

export const FormSchema = z.object({
  billName: z.string().min(1, { message: "Bill name is required" }),
  billType: z.string().min(1, { message: "Bill type is required" }),
  serviceProvider: z.string().min(1, { message: "Service provider is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  dueDate: z.date(),
  notes: z.string().optional(),
  priority: z.enum(["high", "medium", "low"]),
  sponsor: z.string().optional(),
  // Add the ID field to the schema
  id: z.string().optional(),
});

export type FormValues = z.infer<typeof FormSchema>;

export interface CreateBundleSheetProps {
  trigger?: React.ReactElement;
}

export interface BundleProps {
  name: string;
  id: string;
  supporterId: string;
  createdAt: string;
  notes?: string;
  totalAmount: number;
  status: string;
  supporterName: string;
}
