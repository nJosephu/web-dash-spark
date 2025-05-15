import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface RequestRequester {
  name: string;
  avatar?: string;
  email?: string;
}

interface RequestCardProps {
  id: string;
  displayId: string;
  title: string;
  amount: number;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  requester: RequestRequester;
  isBeneficiary?: boolean;
}

const RequestCard = ({
  id,
  displayId,
  title,
  amount,
  date,
  status,
  requester,
  isBeneficiary = true,
}: RequestCardProps) => {
  // Determine correct link based on role
  const detailsLink = isBeneficiary
    ? `/dashboard/beneficiary/requests/${id}`
    : `/dashboard/sponsor/requests/${id}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
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
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format the amount as currency in Naira
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {/* Header with ID and status */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-500 text-sm flex items-center">
          {displayId}
        </div>
        <Badge className={`font-medium ${getStatusColor(status)}`}>
          {status}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="font-medium text-lg mb-4">{title}</h3>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">Amount</span>
          <span className="font-medium">{formattedAmount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">
            {isBeneficiary ? "Due date" : "Date"}
          </span>
          <span>{formatDate(date)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {isBeneficiary ? "Sponsor" : "Requester"}
          </span>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {requester.avatar ? (
                <AvatarImage src={requester.avatar} alt={requester.name} />
              ) : null}
              <AvatarFallback className="text-xs bg-gray-200">
                {getInitials(requester.name)}
              </AvatarFallback>
            </Avatar>
            <span>{requester.name}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4">
        <Button
          asChild
          className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white w-full justify-center"
        >
          <Link to={detailsLink} className="flex items-center justify-center">
            View details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RequestCard;
