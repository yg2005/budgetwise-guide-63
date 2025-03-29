
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  LineChart, 
  Target, 
  Settings, 
  Menu, 
  X,
  PiggyBank,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Navigation items definition
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Transactions", icon: ArrowRightLeft, path: "/transactions" },
  { name: "Insights", icon: LineChart, path: "/insights" },
  { name: "Goals", icon: Target, path: "/goals" },
  { name: "Education", icon: BookOpen, path: "/education" },
  { name: "Settings", icon: Settings, path: "/settings" }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // For mobile: toggle sidebar visibility
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  // For desktop: toggle sidebar collapsed state
  const toggleCollapsed = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  // Get sidebar visibility class based on device and state
  const sidebarVisibilityClass = isMobile
    ? mobileOpen ? "translate-x-0" : "-translate-x-full"
    : "translate-x-0";
  
  // Get sidebar width based on collapsed state and device
  const sidebarWidthClass = isMobile
    ? "w-64"
    : collapsed ? "w-16" : "w-64";
  
  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-30"
        >
          <Menu size={20} />
        </Button>
      )}
      
      {/* Sidebar Backdrop (Mobile only) */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar shadow-lg z-40",
          "transition-all duration-300 ease-in-out",
          sidebarVisibilityClass,
          sidebarWidthClass
        )}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6 text-budget-teal" />
            {(!collapsed || isMobile) && (
              <span className="font-semibold text-lg">BudgetAI</span>
            )}
          </div>
          
          {/* Close button on mobile / Collapse toggle on desktop */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={isMobile ? toggleMobileSidebar : toggleCollapsed} 
            className="h-8 w-8 p-0"
          >
            {isMobile ? <X size={16} /> : collapsed ? <Menu size={16} /> : <X size={16} />}
          </Button>
        </div>
        
        {/* Navigation Links */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus:outline-none"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", collapsed && !isMobile ? "mx-auto" : "mr-3")} />
                  {(!collapsed || isMobile) && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
