
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Users,
  Receipt,
  LogOut,
  Settings,
  SwitchCamera,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "../../images/logo2kpurple.png";

interface SidebarProps {
  className?: string;
}

const BeneficiarySidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard/beneficiary",
    },
    {
      title: "My requests",
      icon: FileText,
      path: "/dashboard/beneficiary/requests",
    },
    {
      title: "Sponsors",
      icon: Users,
      path: "/dashboard/beneficiary/sponsors",
    },
    {
      title: "Bill history",
      icon: Receipt,
      path: "/dashboard/beneficiary/bill-history",
    },
  ];

  const bottomItems = [
    {
      title: "Switch to sponsor",
      icon: SwitchCamera,
      path: "/switch",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/dashboard/beneficiary/settings",
    },
    {
      title: "Log out",
      icon: LogOut,
      path: "/logout",
    },
  ];

  // Improved helper function to determine if an item is active
  const isItemActive = (path: string): boolean => {
    const currentPath = location.pathname;
    
    // For the dashboard, only match the exact path
    if (path === "/dashboard/beneficiary") {
      return currentPath === "/dashboard/beneficiary";
    }
    
    // For other routes, check if the current path starts with the given path
    // But make sure it's a proper match
    if (currentPath === path) {
      return true;
    }
    
    // Handle bundle details pages
    if (path === "/dashboard/beneficiary/requests" && currentPath.startsWith("/dashboard/beneficiary/requests/")) {
      return true;
    }
    
    // Handle other subpath cases (sponsors, bill-history, settings)
    if (currentPath.startsWith(path + "/")) {
      return true;
    }
    
    return false;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A1F2C] text-white">
      <div className="p-4 flex items-center gap-2">
        <img src={logo} alt="Urgent 2kay" className="h-6 md:h-8" />
      </div>

      <nav className="flex flex-col flex-1 px-4 py-8 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
              isItemActive(item.path)
                ? "bg-[#6544E4] text-white"
                : "text-gray-300 hover:bg-sidebar-hover"
            )}
          >
            <item.icon size={20} />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-700 mt-auto">
        <nav className="flex flex-col px-4 py-4 space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-[#6544E4] text-white"
                  : "text-gray-300 hover:bg-sidebar-hover"
              )}
            >
              <item.icon size={20} />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-4 z-50 bg-[#F1EDFF]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "w-64 hidden md:flex flex-col bg-[#1A1F2C] text-white h-full fixed left-0 top-0 z-50",
        className
      )}
    >
      <SidebarContent />
    </aside>
  );
};

export default BeneficiarySidebar;
