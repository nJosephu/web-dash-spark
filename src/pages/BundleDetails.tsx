
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Check, Clock, File, FileText, Package, Tag, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BundleItem {
  name: string;
  amount: string;
  priority?: "high" | "medium" | "low";
  category?: string;
}

interface ActivityLog {
  type: string;
  message: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  completed?: boolean;
}

interface Bundle {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  sponsor: {
    name: string;
    avatar?: string;
  };
  priority?: "high" | "medium" | "low";
  description?: string;
  items: BundleItem[];
  activityLog: ActivityLog[];
}

// Mock data for the bundle details
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getActivityIcon = (type: string, completed: boolean | undefined) => {
    if (completed) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    
    switch (type) {
      case "created":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "sent":
        return <ArrowLeft className="h-4 w-4 text-purple-500" />;
      case "viewed":
        return <File className="h-4 w-4 text-gray-500" />;
      case "approved":
        return <Tag className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      case "completed":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
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

  if (!bundle) {
    return <div>Loading...</div>;
  }

  // Group bundle items by category
  const groupedItems: Record<string, BundleItem[]> = {};
  bundle.items.forEach(item => {
    const category = item.category || 'Other';
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6 -ml-3 text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/requests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Button>

          {/* Bundle header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {renderStatusBadge(bundle.status)}
                <span className="text-sm font-medium text-gray-500">{bundle.id}</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">{bundle.title}</h1>
              <p className="text-gray-500">Created on {formatDate(bundle.date)}</p>
            </div>
            <div className="flex gap-3">
              {bundle.status === "pending" && (
                <>
                  <Button variant="outline" className="border-[#6544E4] text-[#6544E4]">
                    Cancel Request
                  </Button>
                  <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                    Resend Request
                  </Button>
                </>
              )}
              {bundle.status === "rejected" && (
                <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                  Resend Request
                </Button>
              )}
              {bundle.status === "approved" && (
                <Button className="bg-green-500 hover:bg-green-600">
                  Download Receipt
                </Button>
              )}
            </div>
          </div>

          {/* Bundle content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left section - Bundle information */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bundle.amount}</div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Due Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatDate(bundle.date)}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Priority
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bundle.priority && (
                      <Badge
                        className={`${getPriorityColor(bundle.priority)} capitalize`}
                        variant="outline"
                      >
                        {bundle.priority}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Bundle items */}
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Bundle Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="font-medium text-sm text-gray-500 mb-3">{category}</h3>
                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <div 
                              key={index}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-[#6544E4]/10 p-2 rounded">
                                  <Package className="h-5 w-5 text-[#6544E4]" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  {item.priority && (
                                    <Badge
                                      className={`${getPriorityColor(item.priority)} capitalize mt-1 text-xs`}
                                      variant="outline"
                                    >
                                      {item.priority}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <span className="font-semibold">{item.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bundle summary */}
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Bundle Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                      <p>{bundle.description || "No description provided."}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Sponsor</h4>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          {bundle.sponsor.avatar ? (
                            <AvatarImage src={bundle.sponsor.avatar} alt={bundle.sponsor.name} />
                          ) : null}
                          <AvatarFallback>
                            {getInitials(bundle.sponsor.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{bundle.sponsor.name}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Total Amount</h4>
                      <div className="flex justify-between py-2 border-t border-b">
                        <span>Total</span>
                        <span className="font-bold">{bundle.amount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right section - Activity log */}
            <div>
              <Card className="sticky top-6 border shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {bundle.activityLog.map((activity, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${activity.completed ? "bg-green-100" : "bg-gray-100"}`}>
                            {getActivityIcon(activity.type, activity.completed)}
                          </div>
                          {index < bundle.activityLog.length - 1 && (
                            <div className="absolute top-7 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatActivityTime(activity.timestamp)}
                            </span>
                            {activity.user && (
                              <span className="text-xs text-gray-500">
                                {activity.user.name}
                              </span>
                            )}
                          </div>
                          {index < bundle.activityLog.length - 1 && (
                            <Separator className="my-4 bg-transparent" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDetails;
