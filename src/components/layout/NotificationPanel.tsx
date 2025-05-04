
import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Notification, NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Request approved",
    message: "Your bill request has been approved by WorldStar Health",
    isRead: false,
    timestamp: "2025-05-04T09:30:00Z",
    actionUrl: "/requests/123",
  },
  {
    id: "2",
    type: "info",
    title: "New sponsor available",
    message: "FastTech has been added as a new sponsor",
    isRead: true,
    timestamp: "2025-05-03T14:20:00Z",
    actionUrl: "/sponsors",
  },
  {
    id: "3",
    type: "error",
    title: "Payment failed",
    message: "Your payment for bill request #456 has failed",
    isRead: false,
    timestamp: "2025-05-02T11:45:00Z",
    actionUrl: "/bill-history",
  },
  {
    id: "4",
    type: "warning",
    title: "Request expiring soon",
    message: "Your bill request #789 will expire in 24 hours",
    isRead: true,
    timestamp: "2025-05-01T16:15:00Z",
    actionUrl: "/requests/789",
  },
];

// Function to get notification icon based on type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "success":
      return <div className="h-2 w-2 rounded-full bg-urgent-green"></div>;
    case "error":
      return <div className="h-2 w-2 rounded-full bg-urgent-red"></div>;
    case "warning":
      return <div className="h-2 w-2 rounded-full bg-urgent-yellow"></div>;
    case "info":
    default:
      return <div className="h-2 w-2 rounded-full bg-urgent-blue"></div>;
  }
};

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    // Less than 24 hours ago
    const hours = Math.floor(diffInHours);
    return hours === 0 ? "Just now" : `${hours}h ago`;
  } else if (diffInHours < 48) {
    // Yesterday
    return "Yesterday";
  } else {
    // Format as date
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  }
};

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };
  
  const handleArchiveAll = () => {
    setNotifications([]);
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    
    // Navigate to action URL if provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
          <SheetTitle className="text-lg font-medium">Notifications</SheetTitle>
          <div className="flex gap-2 items-center">
            {notifications.length > 0 && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="text-xs hover:bg-gray-100"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleArchiveAll}
                  className="text-xs hover:bg-gray-100"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetHeader>

      <div className="pt-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any notifications right now
            </p>
          </div>
        ) : (
          <div>
            {unreadCount > 0 && (
              <div className="px-1 mb-2">
                <p className="text-xs font-medium text-gray-500">NEW ({unreadCount})</p>
              </div>
            )}
            
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div 
                  className={cn(
                    "px-1 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 rounded transition-colors",
                    !notification.isRead && "bg-[#F1EDFF]"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="pt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={cn(
                        "text-sm",
                        !notification.isRead ? "font-medium" : "font-normal"
                      )}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
            
            {unreadCount > 0 && notifications.some(n => n.isRead) && (
              <div className="px-1 mt-4 mb-2">
                <p className="text-xs font-medium text-gray-500">EARLIER</p>
              </div>
            )}
          </div>
        )}
      </div>
    </SheetContent>
  );
};

export default NotificationPanel;
