import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";

interface NotificationActionsProps {
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

const NotificationActions = ({
  onMarkAllRead,
  onClearAll,
}: NotificationActionsProps) => {
  return (
    <div className="px-6 py-4 bg-white border-t flex justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={onMarkAllRead}
        className="text-xs hover:bg-gray-100"
      >
        <Check className="h-3 w-3 mr-1" />
        Mark all read
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs hover:bg-gray-100"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Clear all
      </Button>
    </div>
  );
};

export default NotificationActions;
