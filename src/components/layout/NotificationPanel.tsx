import { Separator } from "@/components/ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Notification } from "@/types/notification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationItem from "@/components/notification/NotificationItem";
import EmptyNotificationState from "@/components/notification/EmptyNotificationState";
import NotificationActions from "@/components/notification/NotificationActions";
import { mockNotifications } from "@/data/mockNotifications";

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleArchiveAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

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
        </div>
      </SheetHeader>

      <div className="pt-4 pb-20">
        {notifications.length === 0 ? (
          <EmptyNotificationState />
        ) : (
          <div>
            {unreadCount > 0 && (
              <div className="px-1 mb-2">
                <p className="text-xs font-medium text-gray-500">
                  NEW ({unreadCount})
                </p>
              </div>
            )}

            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onClick={handleNotificationClick}
                />
                {index < notifications.length - 1 && (
                  <Separator className="my-1" />
                )}
              </div>
            ))}

            {unreadCount > 0 && notifications.some((n) => n.isRead) && (
              <div className="px-1 mt-4 mb-2">
                <p className="text-xs font-medium text-gray-500">EARLIER</p>
              </div>
            )}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <NotificationActions
          onMarkAllRead={handleMarkAllAsRead}
          onClearAll={handleArchiveAll}
        />
      )}
    </SheetContent>
  );
};

export default NotificationPanel;
