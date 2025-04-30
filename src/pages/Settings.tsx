import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [generalForm, setGeneralForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567"
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile information updated successfully");
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Password updated successfully");
    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={generalForm.name} 
                    onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={generalForm.email} 
                    onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={generalForm.phone} 
                    onChange={(e) => setGeneralForm({...generalForm, phone: e.target.value})}
                  />
                </div>
                
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={securityForm.currentPassword} 
                    onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={securityForm.newPassword} 
                    onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={securityForm.confirmPassword} 
                    onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                  />
                </div>
                
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">Current Plan</h3>
                    <p className="text-muted-foreground">Pro Plan <Badge className="ml-2">Active</Badge></p>
                  </div>
                  <Badge variant="outline" className="text-green-600 bg-green-50">Renews May 30, 2025</Badge>
                </div>
                <Button variant="outline">Change Plan</Button>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Payment Method</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-slate-200 rounded mr-3 flex items-center justify-center">
                      VISA
                    </div>
                    <div>
                      <p>Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                    </div>
                  </div>
                  <Button variant="ghost">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground mb-4">
                  Configure how and when you want to be notified.
                </p>
                
                {/* Notification preferences content would go here */}
                <p>Notification preferences placeholder content</p>
                
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
