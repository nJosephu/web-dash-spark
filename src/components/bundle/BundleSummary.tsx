
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Person {
  name: string;
  avatar?: string;
  email?: string;
}

interface BundleSummaryProps {
  description?: string;
  sponsor?: Person;
  requester?: Person;
  amount: string;
  createdAt?: string;
  dueDate?: string;
  showRequester?: boolean;
  showSponsor?: boolean;
}

const BundleSummary: React.FC<BundleSummaryProps> = ({
  description,
  sponsor,
  requester,
  amount,
  createdAt,
  dueDate,
  showRequester = true,
  showSponsor = true,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Bundle Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {createdAt && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Date Created
              </h4>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h4>
            <p>{description || "No description provided."}</p>
          </div>

          {showRequester && requester && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Requester</h4>
              <div className="flex items-center gap-2">
                <Avatar>
                  {requester.avatar ? (
                    <AvatarImage src={requester.avatar} alt={requester.name} />
                  ) : null}
                  <AvatarFallback>{getInitials(requester.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div>{requester.name}</div>
                  {requester.email && (
                    <div className="text-sm text-gray-500">{requester.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showSponsor && sponsor && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Sponsor</h4>
              <div className="flex items-center gap-2">
                <Avatar>
                  {sponsor.avatar ? (
                    <AvatarImage src={sponsor.avatar} alt={sponsor.name} />
                  ) : null}
                  <AvatarFallback>{getInitials(sponsor.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div>{sponsor.name}</div>
                  {sponsor.email && (
                    <div className="text-sm text-gray-500">{sponsor.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Total Amount
            </h4>
            <div className="flex justify-between py-2 border-t border-b">
              <span>Total</span>
              <span className="font-bold">{amount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleSummary;
