
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Settings as SettingsIcon, User, Bell, Lock, CreditCard } from "lucide-react";

const Settings = () => {
  useEffect(() => {
    document.title = "Settings | Urgent2kay";
  }, []);

  const [userProfile, setUserProfile] = useState({
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "+234 801 234 5678",
    address: "123 Main Street, Lagos, Nigeria",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    billReminders: true,
    marketingEmails: false,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  const handleNotificationChange = (setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    toast.success("Notification preferences updated");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userProfile.fullName.split(" ")[0]} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-gray-500">Manage your account preferences</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5 text-[#6544E4]" />
                <CardTitle>Account Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="profile">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="mr-2 h-4 w-4" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Lock className="mr-2 h-4 w-4" /> Security
                  </TabsTrigger>
                  <TabsTrigger value="payment">
                    <CreditCard className="mr-2 h-4 w-4" /> Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={userProfile.fullName}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                fullName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userProfile.email}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={userProfile.phone}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={userProfile.address}
                            onChange={(e) =>
                              setUserProfile({
                                ...userProfile,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                      Save Changes
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="notifications">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive email notifications for account updates
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.emailNotifications} 
                        onCheckedChange={() => handleNotificationChange("emailNotifications")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive push notifications on your mobile device
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.pushNotifications} 
                        onCheckedChange={() => handleNotificationChange("pushNotifications")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Bill Reminders</h3>
                        <p className="text-sm text-gray-500">
                          Get reminders before bills are due
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.billReminders} 
                        onCheckedChange={() => handleNotificationChange("billReminders")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">
                          Receive promotional emails and offers
                        </p>
                      </div>
                      <Switch 
                        checked={notifications.marketingEmails} 
                        onCheckedChange={() => handleNotificationChange("marketingEmails")}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                      <Button 
                        className="mt-4 bg-[#6544E4] hover:bg-[#5A3DD0]"
                        onClick={() => toast.success("Password changed successfully")}
                      >
                        Update Password
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Payment Methods</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Manage your payment methods
                      </p>
                      <div className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-gray-500">Expires 04/2027</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-none">Default</Badge>
                        </div>
                      </div>
                      <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                        Add Payment Method
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Billing Address</h3>
                      <p className="text-gray-600 mb-4">
                        123 Main Street, Lagos, Nigeria
                      </p>
                      <Button variant="outline">Update Billing Address</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
