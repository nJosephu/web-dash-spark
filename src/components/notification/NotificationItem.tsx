
import { Notification } from "@/types/notification";
import { formatRelativeDate } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";
import NotificationIcon from "./NotificationIcon";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  return (
    <div 
      className="px-1 py-3 flex gap-3 cursor-pointer hover:bg-gray-50 rounded transition-colors"
      onClick={() => onClick(notification)}
    >
      <div className="pt-0.5">
        <NotificationIcon type={notification.type} />
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
            {formatRelativeDate(notification.timestamp)}
          </span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          <span>{notification.message} </span>
          {notification.recipientName && (
            <span className="text-[#6544E4] font-medium cursor-pointer hover:underline">
              {notification.recipientName}
            </span>
          )}
          {notification.amount && (
            <div className="font-medium mt-1">{notification.amount}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
