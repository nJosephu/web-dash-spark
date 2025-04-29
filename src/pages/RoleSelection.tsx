
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    
    // Save the role in localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({
      ...userData,
      role: selectedRole
    }));
    
    localStorage.setItem("authenticated", "true");
    toast.success("Account setup completed");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.1 4C25.2 6.2 26.6 9.3 26.6 12.7C26.6 16.1 25.2 19.2 23.1 21.4" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4.9 21.4C2.8 19.2 1.4 16.1 1.4 12.7C1.4 9.3 2.8 6.2 4.9 4" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <path d="M18.2 7.80005C19.4 9.00005 20.3 10.8 20.3 12.7C20.3 14.6 19.5 16.4 18.2 17.6" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <path d="M9.8 17.6C8.6 16.4 7.7 14.6 7.7 12.7C7.7 10.8 8.5 9.00005 9.8 7.80005" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="14" cy="12.7" r="3.5" fill="#7B68EE"/>
            </svg>
            <span className="text-2xl font-bold text-gray-900">Urgent2kay</span>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Choose your role</h2>
          <p className="text-gray-500 mt-2">Select how you want to use Urgent2kay</p>
        </div>
        
        <Card className="border shadow-md">
          <CardContent className="pt-6">
            <RadioGroup 
              className="gap-4"
              value={selectedRole || ""}
              onValueChange={setSelectedRole}
            >
              <div className={`flex items-start space-x-3 border rounded-lg p-4 ${selectedRole === 'beneficiary' ? 'border-[#7B68EE] bg-purple-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="beneficiary" id="beneficiary" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="beneficiary" className="text-base font-medium">I need urgent cash</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Request funds for your urgent needs and connect with sponsors
                  </p>
                </div>
              </div>
              
              <div className={`flex items-start space-x-3 border rounded-lg p-4 ${selectedRole === 'sponsor' ? 'border-[#7B68EE] bg-purple-50' : 'border-gray-200'}`}>
                <RadioGroupItem value="sponsor" id="sponsor" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="sponsor" className="text-base font-medium">I want to sponsor others</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Fund urgent cash requests and help those in need
                  </p>
                </div>
              </div>
            </RadioGroup>
            
            <div className="mt-6">
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#7B68EE] hover:bg-[#6A57DD]"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
