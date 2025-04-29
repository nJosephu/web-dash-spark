
import { Bell, LayoutGrid } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TopNavProps {
  userName: string;
}

const TopNav = ({ userName }: TopNavProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-30 flex justify-between items-center py-4 px-4 md:px-6 mb-6 border-b border-gray-100 bg-white">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-sm md:text-base font-semibold text-gray-800 flex items-center gap-2">
            <LayoutGrid size={18} className="text-gray-700" />
            Dashboard
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="block text-xs text-gray-500">Wallet</span>
          <span className="font-medium text-sm">₦94A...R3DC</span>
        </div>
        
        <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-md bg-white">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
