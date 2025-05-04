
import { Bell, Filter } from "lucide-react";

interface EmptyNotificationStateProps {
  hasFilters?: boolean;
}

const EmptyNotificationState = ({ hasFilters = false }: EmptyNotificationStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {hasFilters ? (
        <>
          <Filter className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No matching notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters to see more results
          </p>
        </>
      ) : (
        <>
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any notifications right now
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyNotificationState;
