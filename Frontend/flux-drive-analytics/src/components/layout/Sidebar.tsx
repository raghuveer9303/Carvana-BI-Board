import { 
  Home, 
  BarChart3, 
  Car, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  FileText,
  Users,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { name: "Dashboard", icon: Home, href: "/", active: true },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Inventory", icon: Package, href: "/inventory" },
  { name: "Sales", icon: TrendingUp, href: "/sales" },
  { name: "Vehicles", icon: Car, href: "/vehicles" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "Help", icon: HelpCircle, href: "/help" },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      "bg-sidebar border-r border-sidebar-border",
      className
    )}>
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">
                  VehicleOS
                </h2>
                <p className="text-xs text-sidebar-foreground/60">
                  Analytics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "justify-center px-2",
                  item.active 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                asChild
              >
                <a href={item.href}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </a>
              </Button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <BarChart3 className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}