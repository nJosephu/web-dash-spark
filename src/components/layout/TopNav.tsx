
import {
  LayoutGrid,
  FileText,
  Users,
  Receipt,
  SwitchCamera,
  Settings,
  LogOut,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import NotificationPanel from "./NotificationPanel";
import LogoutConfirmation from "../auth/LogoutConfirmation";
import Bell from "../../images/notification-bing.png";

interface TopNavProps {
  userName: string;
}

const TopNav = ({ userName }: TopNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Add cache control meta tag to prevent back button issues
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Cache-Control');
    metaTag.setAttribute('content', 'no-cache, no-store, must-revalidate');
    document.head.appendChild(metaTag);
    
    // Check authentication status on component mount
    const verifyAuthState = () => {
      const sessionToken = sessionStorage.getItem('token');
      const sessionUser = sessionStorage.getItem('user');
      
      console.log("TopNav - Verifying auth state:", {
        hasToken: !!sessionToken,
        hasUser: !!sessionUser,
        path: location.pathname,
        isProtectedRoute: location.pathname.includes('/dashboard')
      });
    };
    
    verifyAuthState();
    
    // Add event listener for popstate (back/forward button)
    const handlePopState = () => {
      console.log("TopNav - Browser navigation detected, verifying auth state");
      verifyAuthState();
      
      // If navigating to dashboard but not authenticated, redirect to login
      if (location.pathname.includes('/dashboard')) {
        const sessionToken = sessionStorage.getItem('token');
        const sessionUser = sessionStorage.getItem('user');
        
        if (!sessionToken || !sessionUser) {
          console.log("TopNav - Unauthenticated access attempt via browser navigation, redirecting to login");
          navigate('/login', { replace: true });
        }
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.head.removeChild(metaTag);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  const getPageInfo = () => {
    const path = location.pathname;

    // Check if we're on a bundle details page
    if (path.match(/\/dashboard\/(sponsor|beneficiary)\/requests\/[^\/]+$/)) {
      return {
        title: "Bundle Details",
        icon: <Package size={18} className="text-gray-700" />,
      };
    }

    // Check for exact dashboard paths
    if (path === "/dashboard/sponsor") {
      return {
        title: "Dashboard",
        icon: <LayoutGrid size={18} className="text-gray-700" />,
      };
    }

    if (path === "/dashboard/beneficiary") {
      return {
        title: "Dashboard",
        icon: <LayoutGrid size={18} className="text-gray-700" />,
      };
    }

    // Check for requests paths - more specific matching
    if (path.includes("/sponsor/requests")) {
      return {
        title: "Fund Requests",
        icon: <FileText size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/beneficiary/requests")) {
      return {
        title: "My Requests",
        icon: <FileText size={18} className="text-gray-700" />,
      };
    }

    // Check for other common paths - more specific matching
    if (path.includes("/sponsors")) {
      return {
        title: "Sponsors",
        icon: <Users size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/beneficiaries")) {
      return {
        title: "Beneficiaries",
        icon: <Users size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/bill-history")) {
      return {
        title: "Bill History",
        icon: <Receipt size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/bills-paid")) {
      return {
        title: "Bills Paid",
        icon: <Receipt size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/settings")) {
      return {
        title: "Settings",
        icon: <Settings size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/switch")) {
      return {
        title: "Switch Role",
        icon: <SwitchCamera size={18} className="text-gray-700" />,
      };
    }

    if (path.includes("/logout")) {
      return {
        title: "Logout",
        icon: <LogOut size={18} className="text-gray-700" />,
      };
    }

    // Default fallback
    return {
      title: "Dashboard",
      icon: <LayoutGrid size={18} className="text-gray-700" />,
    };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="sticky top-0 z-30 flex justify-between items-center py-4 px-4 pl-16 md:px-6 mb-6 border-b border-gray-100 bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-sm md:text-base font-medium text-gray-800 flex items-center gap-2">
            <span className="hidden md:block">{pageInfo?.icon}</span>
            {pageInfo?.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        {/* <div className="text-right hidden sm:block">
          <span className="block text-xs text-gray-500">Wallet</span>
          <span className="font-medium text-sm ">₦94A...R3DC</span>
        </div> */}

        <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="relative h-9 w-9 rounded-md bg-white"
            >
              <img src={Bell} alt="bell-notification" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-[#6544E4] rounded-full border border-white"></span>
            </Button>
          </SheetTrigger>
          <NotificationPanel onClose={() => setIsNotificationOpen(false)} />
        </Sheet>

        <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-100 text-gray-700 border border-gray-200">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
