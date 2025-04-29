
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, BanknoteIcon } from "lucide-react";

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
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
            <span className="text-2xl font-bold text-white">Urgent2kay</span>
          </div>
        </div>
        
        <Card className="border-0 shadow-2xl rounded-xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">How do you want to sign up?</h2>
              <p className="text-gray-500 mt-2">Choose a category to sign up in</p>
            </div>
            
            <RadioGroup 
              className="gap-6"
              value={selectedRole || ""}
              onValueChange={setSelectedRole}
            >
              <div className={`flex items-start space-x-4 border rounded-xl p-5 ${selectedRole === 'beneficiary' ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
                <div className="pt-1">
                  <RadioGroupItem value="beneficiary" id="beneficiary" className="border-gray-400" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="beneficiary" className="text-lg font-semibold text-gray-900">Sign up as a Beneficiary</Label>
                  <p className="text-gray-500 mt-1">
                    Request bills payments and get funds for other necessities
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">Get your bills paid by sponsors</span>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-start space-x-4 border rounded-xl p-5 ${selectedRole === 'sponsor' ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
                <div className="pt-1">
                  <RadioGroupItem value="sponsor" id="sponsor" className="border-gray-400" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="sponsor" className="text-lg font-semibold text-gray-900">Sign up as a Sponsor</Label>
                  <p className="text-gray-500 mt-1">
                    Help pay bills and provide essential funds for others
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <BanknoteIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">Support those in need with bill payments</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
            
            <div className="mt-8">
              <Button 
                onClick={handleContinue}
                className="w-full bg-[#7B68EE] hover:bg-[#6A57DD] text-white rounded-lg py-6 font-medium"
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
