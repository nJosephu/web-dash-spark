
import { Check, X } from "lucide-react";
import { NotificationType } from "@/types/notification";

interface NotificationIconProps {
  type: NotificationType;
}

const NotificationIcon = ({ type }: NotificationIconProps) => {
  switch (type) {
    case "success":
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-urgent-green bg-opacity-15">
          <Check className="h-3.5 w-3.5 text-urgent-green" />
        </div>
      );
    case "error":
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-urgent-red bg-opacity-15">
          <X className="h-3.5 w-3.5 text-urgent-red" />
        </div>
      );
    case "warning":
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-urgent-yellow bg-opacity-15">
          <div className="h-3.5 w-3.5 flex items-center justify-center text-urgent-yellow font-bold">!</div>
        </div>
      );
    case "info":
    default:
      return (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-urgent-blue bg-opacity-15">
          <div className="h-3.5 w-3.5 flex items-center justify-center text-urgent-blue font-bold">i</div>
        </div>
      );
  }
};

export default NotificationIcon;
