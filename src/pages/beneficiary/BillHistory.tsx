import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { useBills } from "@/hooks/useBills";

const BillHistory = () => {
  const { refetch } = useBills();

  useEffect(() => {
    document.title = "Bill History | Urgent2kay";

    // Explicitly refetch data when component mounts
    console.log("BillHistory component mounted - refreshing bills data");
    refetch()
      .then(() => {
        console.log("Bills data refreshed successfully");
      })
      .catch((error) => {
        console.error("Error refreshing bills data:", error);
      });

    // Set up interval to periodically refresh data (every 30 seconds)
    const refreshInterval = setInterval(() => {
      refetch().catch((error) => {
        console.error("Error in periodic refresh:", error);
      });
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [refetch]);

  useEffect(() => {
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="mb-6">
        <p className="text-gray-500">View and track all your bill payments</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <RequestsTable limit={5} showViewAll={false} showPagination={true} />
        </CardContent>
      </Card>
    </>
  );
};

export default BillHistory;
