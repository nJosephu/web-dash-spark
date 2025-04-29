
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
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">How do you want to sign up?</h2>
          <p className="text-gray-500 mt-2">Choose a category to sign up in</p>
        </div>
        
        <Card className="border shadow-md rounded-xl overflow-hidden">
          <CardContent className="pt-6 pb-6">
            <RadioGroup 
              className="gap-4"
              value={selectedRole || ""}
              onValueChange={setSelectedRole}
            >
              <div className={`flex items-start space-x-3 border rounded-lg p-5 ${selectedRole === 'beneficiary' ? 'bg-gray-100' : 'border-gray-200'}`}>
                <div>
                  <RadioGroupItem value="beneficiary" id="beneficiary" className="mt-1" />
                </div>
                <div className="flex flex-1">
                  <div className="mr-3 bg-[#7B68EE]/10 rounded-full p-3 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.97 8.18 9.47C8.18 11.21 9.67 12.08 11.84 12.61C13.79 13.08 14.18 13.75 14.18 14.46C14.18 15 13.85 15.82 12.07 15.82C10.42 15.82 9.77 15.11 9.67 14.15H7.95C8.06 15.85 9.39 16.91 10.9 17.22V19H13.23V17.24C14.75 16.96 15.97 16.1 15.97 14.45C15.97 12.28 14.08 11.59 12.31 11.14Z" fill="#7B68EE"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="beneficiary" className="text-base font-medium">I need urgent cash</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Request funds for your urgent needs and connect with sponsors
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-start space-x-3 border rounded-lg p-5 ${selectedRole === 'sponsor' ? 'bg-gray-100' : 'border-gray-200'}`}>
                <div>
                  <RadioGroupItem value="sponsor" id="sponsor" className="mt-1" />
                </div>
                <div className="flex flex-1">
                  <div className="mr-3 bg-[#7B68EE]/10 rounded-full p-3 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="#7B68EE"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="sponsor" className="text-base font-medium">I want to sponsor others</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Fund urgent cash requests and help those in need
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
            
            <div className="mt-8">
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#7B68EE] hover:bg-[#6A57DD] rounded-full py-6"
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
