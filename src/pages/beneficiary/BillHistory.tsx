
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RequestsTable from "@/components/dashboard/RequestsTable";
import { useBills } from "@/hooks/useBills";

const BillHistory = () => {
  const { refetch } = useBills();

  useEffect(() => {
    document.title = "Bill History | Urgent2kay";
    // Refresh the bills data when this page loads
    refetch();
  }, [refetch]);

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
