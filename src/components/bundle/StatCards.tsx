import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface StatCardsProps {
  amount: string;
  date: string;
  priority?: "high" | "medium" | "low";
}

const StatCards: React.FC<StatCardsProps> = ({ amount, date, priority }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total bills in bundle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{amount}</div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Due Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(date)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          {priority && (
            <Badge
              className={`${getPriorityColor(priority)} capitalize`}
              variant="outline"
            >
              {priority}
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          {priority && (
            <Badge
              className={`${getPriorityColor(priority)} capitalize`}
              variant="outline"
            >
              {priority}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
