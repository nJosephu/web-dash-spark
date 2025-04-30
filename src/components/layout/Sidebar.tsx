
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
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "../../images/logo2kpurple.png";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutGrid,
      path: "/",
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
    {
      title: "Log out",
      icon: LogOut,
      path: "/logout",
    },
  ];

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
              className="fixed left-4 top-4 z-50"
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
        "w-64 hidden md:flex flex-col bg-[#1A1F2C] text-white h-screen fixed left-0 top-0",
        className
      )}
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
