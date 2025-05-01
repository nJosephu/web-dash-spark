
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Sponsor {
  name: string;
  avatar?: string;
}

interface BundleSummaryProps {
  description?: string;
  sponsor: Sponsor;
  amount: string;
}

const BundleSummary: React.FC<BundleSummaryProps> = ({ description, sponsor, amount }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Bundle Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
            <p>{description || "No description provided."}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Sponsor</h4>
            <div className="flex items-center gap-2">
              <Avatar>
                {sponsor.avatar ? (
                  <AvatarImage src={sponsor.avatar} alt={sponsor.name} />
                ) : null}
                <AvatarFallback>
                  {getInitials(sponsor.name)}
                </AvatarFallback>
              </Avatar>
              <span>{sponsor.name}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h4>
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
