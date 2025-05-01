import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

// Import the refactored components
import BundleHeader from "@/components/bundle/BundleHeader";
import StatCards from "@/components/bundle/StatCards";
import BundleItems from "@/components/bundle/BundleItems";
import BundleSummary from "@/components/bundle/BundleSummary";
import ActivityLog from "@/components/bundle/ActivityLog";

// Import types from the bundle.d.ts file
import { Bundle } from "@/types/bundle.d.ts";

// Mock data for the bundle details (moved to the main component for simplicity)
const mockBundles: Record<string, Bundle> = {
  "REQ-001": {
    id: "U2K-001289",
    title: "Rent Payment",
    amount: "₦120,000",
    date: "2025-04-25",
    status: "approved",
    sponsor: {
      name: "John Doe",
      avatar: ""
    },
    priority: "high",
    description: "Monthly rent payment for apartment",
    items: [
      { name: "Rent", amount: "₦120,000", priority: "high", category: "Accommodation" }
    ],
    activityLog: [
      {
        type: "created",
        message: "Bundle was created",
        timestamp: "2025-04-20T10:30:00",
        user: {
          name: "You"
        },
        completed: true
      },
      {
        type: "sent",
        message: "Bundle was sent to John Doe",
        timestamp: "2025-04-20T10:35:00",
        user: {
          name: "System"
        },
        completed: true
      },
      {
        type: "viewed",
        message: "John Doe viewed the bundle",
        timestamp: "2025-04-21T14:22:00",
        user: {
          name: "John Doe"
        },
        completed: true
      },
      {
        type: "approved",
        message: "Bundle was approved",
        timestamp: "2025-04-22T09:15:00",
        user: {
          name: "John Doe"
        },
        completed: true
      },
      {
        type: "completed",
        message: "Payment was processed",
        timestamp: "2025-04-23T11:30:00",
        user: {
          name: "System"
        },
        completed: true
      }
    ]
  },
  "REQ-002": {
    id: "U2K-001290",
    title: "Electricity Bill",
    amount: "₦45,000",
    date: "2025-04-22",
    status: "pending",
    sponsor: {
      name: "Jane Smith",
      avatar: ""
    },
    priority: "medium",
    description: "Monthly electricity bill payment",
    items: [
      { name: "Electricity", amount: "₦45,000", priority: "medium", category: "Utilities" }
    ],
    activityLog: [
      {
        type: "created",
        message: "Bundle was created",
        timestamp: "2025-04-18T08:30:00",
        user: {
          name: "You"
        },
        completed: true
      },
      {
        type: "sent",
        message: "Bundle was sent to Jane Smith",
        timestamp: "2025-04-18T08:35:00",
        user: {
          name: "System"
        },
        completed: true
      },
      {
        type: "viewed",
        message: "Jane Smith viewed the bundle",
        timestamp: "2025-04-19T10:15:00",
        user: {
          name: "Jane Smith"
        },
        completed: true
      },
      {
        type: "pending",
        message: "Awaiting sponsor approval",
        timestamp: "2025-04-19T10:20:00",
        user: {
          name: "System"
        },
        completed: false
      }
    ]
  },
  "REQ-003": {
    id: "U2K-001291",
    title: "Water Bill",
    amount: "₦15,000",
    date: "2025-04-18",
    status: "rejected",
    sponsor: {
      name: "Mike Johnson",
      avatar: ""
    },
    priority: "low",
    description: "Monthly water bill payment",
    items: [
      { name: "Water", amount: "₦15,000", priority: "low", category: "Utilities" }
    ],
    activityLog: [
      {
        type: "created",
        message: "Bundle was created",
        timestamp: "2025-04-15T14:30:00",
        user: {
          name: "You"
        },
        completed: true
      },
      {
        type: "sent",
        message: "Bundle was sent to Mike Johnson",
        timestamp: "2025-04-15T14:35:00",
        user: {
          name: "System"
        },
        completed: true
      },
      {
        type: "viewed",
        message: "Mike Johnson viewed the bundle",
        timestamp: "2025-04-16T09:22:00",
        user: {
          name: "Mike Johnson"
        },
        completed: true
      },
      {
        type: "rejected",
        message: "Bundle was rejected: Not in budget this month",
        timestamp: "2025-04-16T10:15:00",
        user: {
          name: "Mike Johnson"
        },
        completed: true
      }
    ]
  },
  "REQ-004": {
    id: "U2K-001292",
    title: "Internet Payment",
    amount: "₦25,000",
    date: "2025-04-15",
    status: "approved",
    sponsor: {
      name: "Mike Johnson",
      avatar: ""
    },
    priority: "medium",
    description: "Monthly internet subscription",
    items: [
      { name: "Internet", amount: "₦25,000", priority: "medium", category: "Utilities" }
    ],
    activityLog: [
      {
        type: "created",
        message: "Bundle was created",
        timestamp: "2025-04-10T10:30:00",
        user: {
          name: "You"
        },
        completed: true
      },
      {
        type: "sent",
        message: "Bundle was sent to Mike Johnson",
        timestamp: "2025-04-10T10:35:00",
        user: {
          name: "System"
        },
        completed: true
      },
      {
        type: "viewed",
        message: "Mike Johnson viewed the bundle",
        timestamp: "2025-04-12T14:22:00",
        user: {
          name: "Mike Johnson"
        },
        completed: true
      },
      {
        type: "approved",
        message: "Bundle was approved",
        timestamp: "2025-04-12T15:15:00",
        user: {
          name: "Mike Johnson"
        },
        completed: true
      },
      {
        type: "completed",
        message: "Payment was processed",
        timestamp: "2025-04-13T11:30:00",
        user: {
          name: "System"
        },
        completed: true
      }
    ]
  },
  "REQ-005": {
    id: "U2K-001293",
    title: "School Fees",
    amount: "₦180,000",
    date: "2025-04-10",
    status: "pending",
    sponsor: {
      name: "Sarah Williams",
      avatar: ""
    },
    priority: "high",
    description: "Semester school fees payment",
    items: [
      { name: "Tuition", amount: "₦150,000", priority: "high", category: "Education" },
      { name: "Books", amount: "₦30,000", priority: "medium", category: "Education" }
    ],
    activityLog: [
      {
        type: "created",
        message: "Bundle was created",
        timestamp: "2025-04-05T16:30:00",
        user: {
          name: "You"
        },
        completed: true
      },
      {
        type: "sent",
        message: "Bundle was sent to Sarah Williams",
        timestamp: "2025-04-05T16:35:00",
        user: {
          name: "System"
        },
        completed: true
      },
      {
        type: "viewed",
        message: "Sarah Williams viewed the bundle",
        timestamp: "2025-04-07T09:22:00",
        user: {
          name: "Sarah Williams"
        },
        completed: true
      },
      {
        type: "pending",
        message: "Awaiting sponsor approval",
        timestamp: "2025-04-07T09:30:00",
        user: {
          name: "System"
        },
        completed: false
      }
    ]
  },
};

const BundleDetails = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [bundle, setBundle] = useState<Bundle | null>(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.email) {
      // Extract name from email (for demo purposes)
      const nameFromEmail = userData.email.split("@")[0];
      setUserName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }

    // Get bundle data
    if (bundleId && mockBundles[bundleId]) {
      setBundle(mockBundles[bundleId]);
      document.title = `${mockBundles[bundleId].title} | Urgent2kay`;
    } else {
      navigate("/requests");
    }
  }, [bundleId, navigate]);

  if (!bundle) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          {/* Bundle header with navigation and action buttons */}
          <BundleHeader 
            id={bundle.id} 
            title={bundle.title} 
            date={bundle.date} 
            status={bundle.status} 
          />

          {/* Bundle content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left section - Bundle information */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats cards */}
              <StatCards 
                amount={bundle.amount} 
                date={bundle.date} 
                priority={bundle.priority} 
              />

              {/* Bundle items */}
              <BundleItems items={bundle.items} />

              {/* Bundle summary */}
              <BundleSummary 
                description={bundle.description} 
                sponsor={bundle.sponsor} 
                amount={bundle.amount} 
              />
            </div>

            {/* Right section - Activity log */}
            <div>
              <ActivityLog activities={bundle.activityLog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDetails;
