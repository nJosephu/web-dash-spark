
import { Notification } from "@/types/notification";

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Bill request approved",
    message: "Your bill request has been approved by",
    recipientName: "WorldStar Health",
    isRead: false,
    timestamp: "2025-05-04T09:30:00Z",
    actionUrl: "/requests/123",
    amount: "₦450,000.00",
  },
  {
    id: "2",
    type: "info",
    title: "New sponsor available",
    message: "has been added as a new sponsor",
    recipientName: "FastTech",
    isRead: true,
    timestamp: "2025-05-03T14:20:00Z",
    actionUrl: "/sponsors",
  },
  {
    id: "3",
    type: "error",
    title: "Payment failed",
    message: "Your payment for bill request #456 has failed",
    isRead: false,
    timestamp: "2025-05-02T11:45:00Z",
    actionUrl: "/bill-history",
    amount: "₦120,000.00",
  },
  {
    id: "4",
    type: "warning",
    title: "Request expiring soon",
    message: "Your bill request #789 will expire in 24 hours",
    isRead: true,
    timestamp: "2025-05-01T16:15:00Z",
    actionUrl: "/requests/789",
    amount: "₦75,500.00",
  },
];
