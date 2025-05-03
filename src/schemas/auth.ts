
import { z } from "zod";

export const signupFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;

// Helper to convert form values to API format
export const mapSignupToApiFormat = (values: SignupFormValues, role: string) => {
  return {
    name: values.username, // Map username to name for API
    email: values.email,
    phone: values.phone,
    password: values.password,
    role: role.toUpperCase(), // API expects uppercase role
  };
};
