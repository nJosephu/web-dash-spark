
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FileText, Users, Receipt, LogOut, Settings, SwitchCamera, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: LayoutGrid,
      path: '/',
    },
    {
      title: 'My requests',
      icon: FileText,
      path: '/requests',
    },
    {
      title: 'Sponsors',
      icon: Users,
      path: '/sponsors',
    },
    {
      title: 'Bill history',
      icon: Receipt,
      path: '/bill-history',
    },
  ];
  
  const bottomItems = [
    {
      title: 'Switch to sponsor',
      icon: SwitchCamera,
      path: '/switch',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
    },
    {
      title: 'Log out',
      icon: LogOut,
      path: '/logout',
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A1F2C] text-white">
      <div className="p-4 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.1 4C25.2 6.2 26.6 9.3 26.6 12.7C26.6 16.1 25.2 19.2 23.1 21.4" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
          <path d="M4.9 21.4C2.8 19.2 1.4 16.1 1.4 12.7C1.4 9.3 2.8 6.2 4.9 4" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
          <path d="M18.2 7.80005C19.4 9.00005 20.3 10.8 20.3 12.7C20.3 14.6 19.5 16.4 18.2 17.6" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
          <path d="M9.8 17.6C8.6 16.4 7.7 14.6 7.7 12.7C7.7 10.8 8.5 9.00005 9.8 7.80005" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="14" cy="12.7" r="3.5" fill="#7B68EE"/>
        </svg>
        <span className="text-lg font-bold">Urgent 2kay</span>
      </div>
      
      <nav className="flex flex-col flex-1 px-4 py-8 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
              location.pathname === item.path 
                ? 'bg-sidebar-active text-white' 
                : 'text-gray-300 hover:bg-sidebar-hover'
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
                'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                location.pathname === item.path 
                  ? 'bg-sidebar-active text-white' 
                  : 'text-gray-300 hover:bg-sidebar-hover'
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
            <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50">
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
    <aside className={cn('w-64 hidden md:flex flex-col bg-[#1A1F2C] text-white h-screen fixed left-0 top-0', className)}>
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
