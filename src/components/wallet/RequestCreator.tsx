
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from "@/context/Web3Context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const RequestCreator = () => {
  const { web3State } = useWeb3();
  const navigate = useNavigate();
  
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateRequest = () => {
    if (!web3State.isConnected) {
      toast.error("Please connect your wallet to create requests");
      return;
    }
    
    if (!web3State.isCorrectNetwork) {
      toast.error(`Please switch to ${BLOCKCHAIN_CONFIG.CHAIN_NAME} to create requests`);
      return;
    }
    
    setIsCreating(true);
    
    // Navigate to the create request page or show a modal
    // For now, we'll just simulate with a toast
    toast.success("Create request feature will be available soon");
    
    setIsCreating(false);
  };
  
  const handleViewRequests = () => {
    // Navigate to the requests page
    navigate("/beneficiary/requests");
  };

  return (
    <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Create a new bill request</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm mb-6">
          Bundle your expenses into one smart request and send it directly
          to your sponsor. Funds go straight to the service providers,
          secure, transparent, and hassle-free.
        </p>
        <div className="space-y-4">
          <Button 
            className="w-full py-6 bg-[#6544E4] hover:bg-[#5335C5] text-white"
            onClick={handleCreateRequest}
            disabled={isCreating || !web3State.isConnected}
          >
            {isCreating 
              ? "Creating Request..." 
              : "Create an URGENT 2KAY Request"}
          </Button>
          <Button
            variant="outline"
            className="w-full py-6 bg-transparent border-gray-700 text-white hover:bg-gray-800"
            onClick={handleViewRequests}
          >
            See Previous Requests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
