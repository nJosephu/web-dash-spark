
import { useMemo } from "react";
import { Request } from "@/services/requestService";

// Function to format currency
const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString()}`;
};

export const useCalculateDashboardMetrics = (requests: Request[] = []) => {
  return useMemo(() => {
    // Initialize metrics
    let totalAmount = 0;
    let approvedAmount = 0;
    let rejectedAmount = 0;
    let pendingAmount = 0;

    // Count requests by status for chart data
    let approvedRequestsCount = 0;
    let rejectedRequestsCount = 0;
    let pendingRequestsCount = 0;
    const totalRequestsCount = requests.length;

    // Calculate metrics
    requests.forEach((request) => {
      // Calculate total amount of bills in the request
      const requestAmount = request.bills.reduce((sum, bill) => sum + bill.amount, 0);
      
      // Add to total amount
      totalAmount += requestAmount;
      
      // Add to status-specific amounts based on request status
      switch (request.status) {
        case "APPROVED":
          approvedAmount += requestAmount;
          approvedRequestsCount++;
          break;
        case "REJECTED":
          rejectedAmount += requestAmount;
          rejectedRequestsCount++;
          break;
        case "PENDING":
          pendingAmount += requestAmount;
          pendingRequestsCount++;
          break;
      }
    });

    // Calculate percentages for chart
    const calculatePercentage = (count: number): number => {
      if (totalRequestsCount === 0) return 0;
      return Math.round((count / totalRequestsCount) * 100);
    };

    const approvedPercentage = calculatePercentage(approvedRequestsCount);
    const rejectedPercentage = calculatePercentage(rejectedRequestsCount);
    const pendingPercentage = calculatePercentage(pendingRequestsCount);

    // Create chart data
    const chartData = [
      {
        name: "Approved",
        value: approvedRequestsCount,
        color: "#7B68EE", // Purple
        percentage: approvedPercentage,
      },
      {
        name: "Rejected",
        value: rejectedRequestsCount,
        color: "#FF5252", // Red
        percentage: rejectedPercentage,
      },
      {
        name: "Pending",
        value: pendingRequestsCount,
        color: "#FFC107", // Yellow
        percentage: pendingPercentage,
      },
    ];

    return {
      totalAmount: formatCurrency(totalAmount),
      approvedAmount: formatCurrency(approvedAmount),
      rejectedAmount: formatCurrency(rejectedAmount),
      pendingAmount: formatCurrency(pendingAmount),
      chartData,
    };
  }, [requests]);
};
