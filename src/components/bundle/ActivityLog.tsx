
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, File, FileText, Package, Tag, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ActivityLogItem {
  type: string;
  message: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  completed?: boolean;
}

interface ActivityLogProps {
  activities: ActivityLogItem[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getActivityIcon = (type: string, completed: boolean | undefined) => {
    if (completed) {
      return <Check className="h-4 w-4 text-green-500" />;
    }

    switch (type) {
      case "created":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "sent":
        return <Package className="h-4 w-4 text-purple-500" />;
      case "viewed":
        return <File className="h-4 w-4 text-gray-500" />;
      case "approved":
        return <Tag className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      case "completed":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="sticky top-6 border">
      <CardHeader className="border-b">
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-3">
              <div className="relative">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    activity.completed ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {getActivityIcon(activity.type, activity.completed)}
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute top-7 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {formatActivityTime(activity.timestamp)}
                  </span>
                  {activity.user && (
                    <span className="text-xs text-gray-500">
                      {activity.user.name}
                    </span>
                  )}
                </div>
                {index < activities.length - 1 && (
                  <Separator className="my-4 bg-transparent" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
