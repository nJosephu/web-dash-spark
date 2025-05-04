
import { Separator } from "@/components/ui/separator";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Notification, NotificationType } from "@/types/notification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationItem from "@/components/notification/NotificationItem";
import EmptyNotificationState from "@/components/notification/EmptyNotificationState";
import NotificationActions from "@/components/notification/NotificationActions";
import { mockNotifications } from "@/data/mockNotifications";
import { Filter } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeFilters, setActiveFilters] = useState<NotificationType[]>([]);
  
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

  const toggleFilter = (type: NotificationType) => {
    setActiveFilters(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Filter notifications based on active filters
  const filteredNotifications = activeFilters.length > 0
    ? notifications.filter(n => activeFilters.includes(n.type))
    : notifications;

  const getNotificationTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'info': return 'Info';
      case 'warning': return 'Warning';
      default: return type;
    }
  };

  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-urgent-green';
      case 'error': return 'bg-urgent-red';
      case 'info': return 'bg-urgent-blue';
      case 'warning': return 'bg-urgent-yellow';
      default: return 'bg-gray-500';
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
      <SheetHeader className="border-b pb-4">
        <div className="flex justify-between items-center">
          <SheetTitle className="text-lg font-medium">Notification</SheetTitle>
        </div>
      </SheetHeader>

      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-1 mb-4">
          {(['success', 'error', 'info', 'warning'] as NotificationType[]).map((type) => (
            <Toggle
              key={type}
              pressed={activeFilters.includes(type)}
              onPressedChange={() => toggleFilter(type)}
              variant="outline"
              size="sm"
              className="rounded-full text-xs px-3 border border-gray-200"
            >
              <span className={`h-2 w-2 rounded-full ${getNotificationTypeColor(type)} mr-1.5`}></span>
              {getNotificationTypeLabel(type)}
            </Toggle>
          ))}
        </div>
      </div>
      
      <Separator className="my-1" />

      <div className="pt-4 pb-20">
        {filteredNotifications.length === 0 ? (
          <EmptyNotificationState hasFilters={activeFilters.length > 0} />
        ) : (
          <div>
            {unreadCount > 0 && filteredNotifications.some(n => !n.isRead) && (
              <div className="px-1 mb-2">
                <p className="text-xs font-medium text-gray-500">NEW ({filteredNotifications.filter(n => !n.isRead).length})</p>
              </div>
            )}
            
            {filteredNotifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem 
                  notification={notification} 
                  onClick={handleNotificationClick} 
                />
                {index < filteredNotifications.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
            
            {filteredNotifications.some(n => !n.isRead) && filteredNotifications.some(n => n.isRead) && (
              <div className="px-1 mt-4 mb-2">
                <p className="text-xs font-medium text-gray-500">EARLIER</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {filteredNotifications.length > 0 && (
        <NotificationActions 
          onMarkAllRead={handleMarkAllAsRead} 
          onClearAll={handleArchiveAll} 
        />
      )}
    </SheetContent>
  );
};

export default NotificationPanel;
