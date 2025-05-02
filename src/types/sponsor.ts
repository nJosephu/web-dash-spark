
// Define sponsor related types
export interface Sponsor {
  id: number;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  joinedDate: string;
}

// Form schema for sponsor creation/editing
export const sponsorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(1, "Please select a relationship"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>;
