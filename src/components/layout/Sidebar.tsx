
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FileText, Users, Receipt, LogOut, Settings, SwitchCamera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  
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

  return (
    <aside className={cn('w-64 flex flex-col bg-sidebar text-white h-screen', className)}>
      <div className="p-4 flex items-center gap-2">
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
    </aside>
  );
};

export default Sidebar;
