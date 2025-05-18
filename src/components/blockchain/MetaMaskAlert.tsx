
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Chrome, AlertTriangle, Info, Link, RefreshCw } from "lucide-react";

interface MetaMaskAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const MetaMaskAlert = ({ isOpen, onClose }: MetaMaskAlertProps) => {
  const handleInstallClick = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#1A1F2C] text-white border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-xl">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            MetaMask Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            To access blockchain features on URGENT 2KAY, you need to install MetaMask.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert className="bg-gray-800 border-gray-700 text-white">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertTitle>What is MetaMask?</AlertTitle>
            <AlertDescription className="text-gray-300">
              MetaMask is a secure wallet for blockchain interactions. It allows you to connect to 
              decentralized applications and manage your digital assets.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Chrome className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">
                Works best with Chrome, Brave, Firefox, or Edge browsers
              </span>
            </div>
            
            <div className="flex items-start gap-2">
              <RefreshCw className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">
                After installation, please refresh this page to connect
              </span>
            </div>
            
            <div className="flex items-start gap-2">
              <Link className="h-5 w-5 mt-0.5 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">
                Visit <a href="https://metamask.io/faqs/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">MetaMask FAQs</a> for help with setup
              </span>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <AlertDialogAction 
            onClick={handleInstallClick}
            className="bg-[#6544E4] hover:bg-[#5335C5] text-white"
          >
            Install MetaMask
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MetaMaskAlert;
