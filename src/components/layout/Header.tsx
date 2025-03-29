
import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const isMobile = useMobile();
  const { user, signOut } = useAuth();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.email) {
      const email = user.email;
      return email.substring(0, 2).toUpperCase();
    }
    return "UA";
  };

  return (
    <header className="bg-background border-b sticky top-0 z-30 flex h-16 w-full items-center px-4">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      <div className="flex items-center gap-2 flex-1">
        <h1 className="font-semibold text-xl hidden md:block">BudgetAI</h1>
        <div className="w-full md:w-96 md:ml-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full bg-background border-muted"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full p-0 h-8 w-8 overflow-hidden" aria-label="User menu">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => window.location.href = "/settings"}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
