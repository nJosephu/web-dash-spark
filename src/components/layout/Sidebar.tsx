
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile, useIsMobileOrTablet } from "@/hooks/use-mobile";
import logo from "../../images/logo2kpurple.png";
import LogoutConfirmation from "../auth/LogoutConfirmation";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isMobileOrTablet = useIsMobileOrTablet();

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      title: "My requests",
      icon: FileText,
      path: "/requests",
    },
    {
      title: "Sponsors",
      icon: Users,
      path: "/sponsors",
    },
    {
      title: "Bill history",
      icon: Receipt,
      path: "/bill-history",
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
      path: "/settings",
    },
  ];

  // Helper function to determine if an item is active
  const isItemActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    // For request details pages, highlight the "My requests" link
    return location.pathname.startsWith(path);
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
          
          {/* Logout button with confirmation */}
          <LogoutConfirmation>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left
                text-gray-300 hover:bg-sidebar-hover"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </LogoutConfirmation>
        </nav>
      </div>
    </div>
  );

  if (isMobileOrTablet) {
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
        "w-64 hidden lg:flex flex-col bg-[#1A1F2C] text-white h-full fixed left-0 top-0 z-50",
        className
      )}
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
