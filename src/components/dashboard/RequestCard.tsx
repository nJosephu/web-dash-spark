
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Copy, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface RequestCardProps {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  sponsor: {
    name: string;
    avatar?: string;
  };
  priority?: "high" | "medium" | "low";
}

const RequestCard = ({
  id,
  title,
  amount,
  date,
  status,
  sponsor,
  priority,
}: RequestCardProps) => {
  const location = useLocation();
  const isSponsor = location.pathname.includes("/dashboard/sponsor");
  
  // Determine correct link based on role (sponsor or beneficiary)
  const detailsLink = isSponsor 
    ? `/dashboard/sponsor/requests/${id}` 
    : `/dashboard/beneficiary/requests/${id}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  const handleCancel = () => {
    toast.success(`Request ${id} has been cancelled`);
  };
  
  const handleRemind = () => {
    toast.success(`Reminder sent to ${sponsor.name}`);
  };

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg ">
      {/* Card Header with ID, status and priority */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Copy className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">{id}</span>
          </div>
          <Badge
            className={`${getStatusColor(
              status
            )} text-xs font-medium capitalize`}
            variant="outline"
          >
            {status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="text-base font-medium mb-4 line-clamp-1">{title}</h3>

        {/* Details */}
        <div className="flex flex-col space-y-3">
          {/* Amount */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Amount</span>
            <span className="text-sm font-semibold">{amount}</span>
          </div>

          {/* Due date */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Due date</span>
            <div className="flex items-center text-xs">
              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
              <span>{formatDate(date)}</span>
            </div>
          </div>

          {/* Sponsor */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Sponsor</span>
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                {sponsor.avatar ? (
                  <AvatarImage src={sponsor.avatar} alt={sponsor.name} />
                ) : null}
                <AvatarFallback className="text-xs bg-gray-100 text-gray-500">
                  {getInitials(sponsor.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{sponsor.name}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          {/* View Details - always shown */}
          <Button
            asChild
            className="w-full bg-[#6544E4] hover:bg-[#5A3DD0] rounded-md h-9 text-xs"
          >
            <Link to={detailsLink}>
              View details
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>

          {/* Cancel and Remind - shown only if not approved and only for beneficiaries */}
          {!isSponsor && status === "pending" && (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50 h-9 text-xs rounded-md"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleRemind}
                variant="outline"
                className="flex-1 text-[#6544E4] border-[#6544E4] hover:bg-[#6544E4]/10 h-9 text-xs rounded-md"
              >
                Remind
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
