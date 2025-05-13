
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequestsTable from "@/components/dashboard/RequestsTable";

const BillHistory = () => {
  useEffect(() => {
    document.title = "Bill History | Urgent2kay";
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-medium">Bill History</h1>
        <p className="text-gray-500">
          View and track all your bill payments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Complete Bill History</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestsTable limit={5} showViewAll={false} showPagination={true} />
        </CardContent>
      </Card>
    </>
  );
};

export default BillHistory;
