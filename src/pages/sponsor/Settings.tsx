
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  bio: z.string().max(160).optional(),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  requestAlerts: z.boolean().default(true),
  paymentConfirmations: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const preferencesFormSchema = z.object({
  maxBudget: z.string(),
  preferredCategories: z.array(z.string()).default([]),
  autoApprove: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

const Settings = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = "Settings | Urgent2kay";
  }, []);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      bio: "",
    },
  });

  // Notifications form
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      requestAlerts: true,
      paymentConfirmations: true,
      marketingEmails: false,
    },
  });

  // Preferences form
  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      maxBudget: "",
      preferredCategories: [],
      autoApprove: false,
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (data: ProfileFormValues) => {
    toast.success("Profile updated successfully");
    console.log("Profile data:", data);
  };

  // Handle notifications form submission
  const onNotificationsSubmit = (data: NotificationsFormValues) => {
    toast.success("Notification preferences updated");
    console.log("Notifications data:", data);
  };

  // Handle preferences form submission
  const onPreferencesSubmit = (data: PreferencesFormValues) => {
    toast.success("Sponsorship preferences updated");
    console.log("Preferences data:", data);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Sponsor Settings</h1>
        <p className="text-gray-500">
          Manage your account and sponsorship preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Email cannot be changed after account creation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 812 345 6789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description about yourself (optional)" 
                            className="resize-none" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be shown on your public sponsor profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit"
                    className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Update Profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sponsorship Preferences</CardTitle>
            <CardDescription>
              Set up your spending limits and funding preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <FormField
                    control={preferencesForm.control}
                    name="maxBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Spending Limit</FormLabel>
                        <FormControl>
                          <Input placeholder="₦100,000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: Set a monthly budget cap for sponsorships
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={preferencesForm.control}
                    name="preferredCategories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Bill Categories</FormLabel>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select categories you prefer to fund" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">Medical Bills</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="housing">Housing</SelectItem>
                            <SelectItem value="utilities">Utilities</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select bill categories you're most interested in sponsoring
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={preferencesForm.control}
                    name="autoApprove"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Automatic Approvals
                          </FormLabel>
                          <FormDescription>
                            Automatically approve recurring requests from beneficiaries you've
                            previously sponsored
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <Button 
                    type="submit"
                    className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Configure how you receive notifications from the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Communication Channels</h3>
                    <p className="text-sm text-gray-500">
                      How would you like to receive notifications?
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Push Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications on your device
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <p className="text-sm text-gray-500">
                      What types of updates would you like to receive?
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <FormField
                      control={notificationsForm.control}
                      name="requestAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>New Request Alerts</FormLabel>
                            <FormDescription>
                              Get notified when new requests match your preferences
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="paymentConfirmations"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Payment Confirmations</FormLabel>
                            <FormDescription>
                              Get notified when your payments are processed
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive promotional content and updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <Button 
                    type="submit"
                    className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500">
                    Update your password to maintain account security
                  </p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Set Up 2FA</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Settings;
