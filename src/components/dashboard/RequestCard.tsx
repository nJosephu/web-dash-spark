
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <Card className="overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">{id}</span>
          <Badge
            className={`${getStatusColor(status)} capitalize`}
            variant="outline"
          >
            {status}
          </Badge>
        </div>
        <div>
          {priority && (
            <Badge
              className={`
                ${
                  priority === "high"
                    ? "bg-red-100 text-red-800"
                    : priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }
              `}
              variant="outline"
            >
              {priority}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">{title}</h3>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total amount</span>
            <span className="font-semibold">{amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Date</span>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1 text-gray-400" />
              <span>{formatDate(date)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Sponsor</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {sponsor.avatar ? (
                  <AvatarImage src={sponsor.avatar} alt={sponsor.name} />
                ) : null}
                <AvatarFallback className="text-xs">
                  {getInitials(sponsor.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{sponsor.name}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            asChild
            className="w-full bg-[#6544E4] hover:bg-[#5A3DD0]"
          >
            <Link to={`/requests/${id}`}>
              View bundle details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Request
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-[#6544E4] border-[#6544E4] hover:bg-[#6544E4]/10"
            >
              Send reminder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
