
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbList
} from "@/components/ui/breadcrumb";

interface TopNavProps {
  userName: string;
}

const TopNav = ({ userName }: TopNavProps) => {
  return (
    <div className="flex justify-between items-center mb-6 py-4 border-b border-gray-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-lg font-medium">
            Dashboard
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <span className="block text-xs text-gray-500">Wallet</span>
          <span className="font-medium text-sm">₦94A...R3DC</span>
        </div>
        
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 h-9">
              Last 30 days
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Last 7 days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            <DropdownMenuItem>Last 90 days</DropdownMenuItem>
            <DropdownMenuItem>This year</DropdownMenuItem>
            <DropdownMenuItem>All time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNav;
