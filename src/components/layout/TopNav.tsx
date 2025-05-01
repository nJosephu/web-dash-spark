import {
  Bell,
  LayoutGrid,
  FileText,
  Users,
  Receipt,
  SwitchCamera,
  Settings,
  LogOut,
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
import { toast } from "sonner";

interface TopNavProps {
  userName: string;
}

const TopNav = ({ userName }: TopNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: "Dashboard",
          icon: <LayoutGrid size={18} className="text-gray-700" />,
        };
      case "/requests":
        return {
          title: "My Requests",
          icon: <FileText size={18} className="text-gray-700" />,
        };
      case "/sponsors":
        return {
          title: "Sponsors",
          icon: <Users size={18} className="text-gray-700" />,
        };
      case "/bill-history":
        return {
          title: "Bill History",
          icon: <Receipt size={18} className="text-gray-700" />,
        };
      case "/switch":
        return {
          title: "Switch Role",
          icon: <SwitchCamera size={18} className="text-gray-700" />,
        };
      case "/settings":
        return {
          title: "Settings",
          icon: <Settings size={18} className="text-gray-700" />,
        };
      case "/logout":
        return {
          title: "Logout",
          icon: <LogOut size={18} className="text-gray-700" />,
        };
      default:
        return {
          title: "Dashboard",
          icon: <LayoutGrid size={18} className="text-gray-700" />,
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="sticky top-0 z-30 flex justify-between items-center py-4 px-4 md:px-6 mb-6 border-b border-gray-100 bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-sm md:text-base font-medium text-gray-800 flex items-center gap-2">
            {pageInfo.icon}
            {pageInfo.title}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="block text-xs text-gray-500">Wallet</span>
          <span className="font-medium text-sm">₦94A...R3DC</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-md bg-white"
        >
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#6544E4] rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-100 text-gray-700 border border-gray-200">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNav;
