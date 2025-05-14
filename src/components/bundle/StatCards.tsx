import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

interface StatCardsProps {
  billsCount?: number;
  approvedBills?: number;
  pendingBills?: number;
  rejectedBills?: number;
  amount?: string;
  date?: string;
}

const StatCards: React.FC<StatCardsProps> = ({
  billsCount = 0,
  approvedBills = 0,
  pendingBills = 0,
  rejectedBills = 0,
  amount,
  date,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
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
          <div className="text-2xl font-bold">{billsCount}</div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Approved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-green-500 font-medium">{approvedBills}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="text-yellow-500 font-medium">{pendingBills}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Rejected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-red-500 font-medium">{rejectedBills}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
