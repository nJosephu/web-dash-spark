import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BundleHeaderProps {
  id: string;
  title: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const BundleHeader: React.FC<BundleHeaderProps> = ({
  id,
  title,
  date,
  status,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status: string) => {
    let bgColor, textColor;

    switch (status) {
      case "pending":
        bgColor = "bg-yellow-500";
        textColor = "text-white";
        break;
      case "approved":
        bgColor = "bg-green-500";
        textColor = "text-white";
        break;
      case "rejected":
        bgColor = "bg-red-500";
        textColor = "text-white";
        break;
      default:
        bgColor = "bg-gray-500";
        textColor = "text-white";
    }

    return (
      <Badge className={`${bgColor} ${textColor} capitalize px-3 py-1`}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6 -ml-3 text-gray-600 hover:text-gray-800"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Requests
      </Button>

      {/* Bundle header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {renderStatusBadge(status)}
            <span className="text-sm font-medium text-gray-500">{id}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-gray-500">Created on {formatDate(date)}</p>
        </div>
        {/* <div className="flex flex-col sm:flex-row gap-3">
          {status === "pending" && (
            <>
              <Button
                variant="outline"
                className="border-[#6544E4] text-[#6544E4]"
              >
                Cancel Request
              </Button>
              <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                Resend Request
              </Button>
            </>
          )}
          {status === "rejected" && (
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
              Resend Request
            </Button>
          )}
          {status === "approved" && (
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
              Download Receipt
            </Button>
          )}
        </div> */}
      </div>
    </>
  );
};

export default BundleHeader;
