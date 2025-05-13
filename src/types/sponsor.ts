
import * as z from "zod";

// Define sponsor related types
export interface Sponsor {
  id: string; // Changed from number to string to match API response
  name: string;
  relationship?: string; // Made optional since it may not be present in all contexts
  email: string;
  phone?: string | null; // Made optional to match API response
  joinedDate?: string; // Made optional since it's derived in some places
  avatar?: string; // Added for UI display
  sponsoredAmount?: string; // Added for UI display
  activeRequests?: number; // Added for UI display
  verified?: boolean; // Added for UI display
  rating?: number; // Added for UI display
  createdAt?: string; // Added to match API response
  updatedAt?: string; // Added to match API response
}

// Form schema for sponsor creation/editing
export const sponsorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(1, "Please select a relationship"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>;
