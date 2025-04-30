
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, BanknoteIcon } from "lucide-react";
import logo from "../images/logo2kpurple.png";

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
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...userData,
        role: selectedRole,
      })
    );

    localStorage.setItem("authenticated", "true");
    toast.success("Account setup completed");
    navigate("/");
  };

  const handleCardClick = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Urgent 2kay" className="h-6 md:h-8" />
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-gray-900">
                How do you want to sign up?
              </h2>
              <p className="text-gray-500 mt-2">
                Choose a category to sign up in
              </p>
            </div>

            <RadioGroup
              className="flex flex-col md:flex-row gap-4 md:gap-6"
              value={selectedRole || ""}
              onValueChange={setSelectedRole}
            >
              <div
                onClick={() => handleCardClick("beneficiary")}
                className={`flex-1 flex items-start justify-between border rounded-xl p-5 cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 
                  ${
                    selectedRole === "beneficiary"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <div className="flex-1">
                  <Label
                    htmlFor="beneficiary"
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    Sign up as a Beneficiary
                  </Label>
                  <p className="text-gray-500 mt-1">
                    Request bills payments and get funds for other necessities
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">
                      Get your bills paid by sponsors
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <RadioGroupItem
                    value="beneficiary"
                    id="beneficiary"
                    className="border-gray-400"
                  />
                </div>
              </div>

              <div
                onClick={() => handleCardClick("sponsor")}
                className={`flex-1 flex items-start justify-between border rounded-xl p-5 cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50
                  ${
                    selectedRole === "sponsor"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200"
                  }`}
              >
                <div className="flex-1">
                  <Label
                    htmlFor="sponsor"
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    Sign up as a Sponsor
                  </Label>
                  <p className="text-gray-500 mt-1">
                    Help pay bills and provide essential funds for others
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <BanknoteIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-600">
                      Support those in need with bill payments
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <RadioGroupItem
                    value="sponsor"
                    id="sponsor"
                    className="border-gray-400"
                  />
                </div>
              </div>
            </RadioGroup>

            <div className="mt-8">
              <Button
                onClick={handleContinue}
                className="w-full bg-[#6544E4] hover:bg-[#5A3DD0] text-white rounded-lg py-6 font-medium"
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
