
import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Menu,
  X,
  Compass
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1",
          active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Button>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Use useCallback to prevent unnecessary re-renders
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  // Function to close the sidebar when clicked outside on mobile
  const handleBackdropClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transition-all duration-300 transform bg-white border-r shadow-sm lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-primary">FCB AirLounge</h1>
              <p className="text-xs text-gray-500">Premium Access</p>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/"
              active={pathname === "/"}
            />
            <SidebarItem
              icon={Users}
              label="Customers"
              href="/customers"
              active={pathname === "/customers" || pathname.startsWith("/customers/")}
            />
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            {pathname === "/" ? (
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=40&h=40" 
                  alt="FCB AirLounge Logo" 
                  className="h-8 w-8 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://via.placeholder.com/40x40";
                  }}
                />
                <span className="ml-2 text-lg font-medium text-gray-800">FCB AirLounge</span>
              </div>
            ) : (
              <h2 className="text-lg font-medium text-gray-800">
                {pathname === "/customers" ? "Customers" :
                 pathname.startsWith("/customers/card/") ? "Membership Card" :
                 pathname.startsWith("/customers/edit/") ? "Edit Customer" :
                 pathname === "/customers/new" ? "New Customer" : ""}
              </h2>
            )}
          </div>
          {/* Help button removed from here */}
        </header>
        
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}
    </div>
  );
};

export default Layout;
