import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  BarChart3,
  Activity,
  Zap,
  FileText,
  Calendar,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  isLoading?: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  selectedPeriod?: '3d' | '7d' | '30d';
  onPeriodChange?: (period: '3d' | '7d' | '30d') => void;
  onLastUpdatedChange?: (date: Date) => void;
}

export function DashboardHeader({ 
  isLoading = false, 
  lastUpdated, 
  onRefresh,
  selectedPeriod = '7d',
  onPeriodChange,
  onLastUpdatedChange
}: DashboardHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [localLastUpdated, setLocalLastUpdated] = useState<Date | undefined>(lastUpdated);

  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;
    
    setIsRefreshing(true);
    setJustUpdated(false);
    
    // Update the lastUpdated timestamp immediately when refresh starts
    const newUpdateTime = new Date();
    setLocalLastUpdated(newUpdateTime);
    if (onLastUpdatedChange) {
      onLastUpdatedChange(newUpdateTime);
    }
    
    // Longer, more realistic loading time (4-6 seconds)
    const loadingTime = 4000 + Math.random() * 2000; // 4-6 seconds
    
    // Call the original refresh function if provided
    if (onRefresh) {
      onRefresh();
    }
    
    setTimeout(() => {
      setIsRefreshing(false);
      setJustUpdated(true);
      
      // Remove the glow effect after 4 seconds (longer to appreciate the effect)
      setTimeout(() => {
        setJustUpdated(false);
      }, 4000);
    }, loadingTime);
  };

  // Reset justUpdated when isLoading changes externally
  useEffect(() => {
    if (!isLoading && !isRefreshing) {
      setJustUpdated(false);
    }
  }, [isLoading, isRefreshing]);

  // Sync localLastUpdated with prop changes
  useEffect(() => {
    if (lastUpdated && (!localLastUpdated || lastUpdated > localLastUpdated)) {
      setLocalLastUpdated(lastUpdated);
    }
  }, [lastUpdated, localLastUpdated]);

  const formatLastUpdated = () => {
    const effectiveLastUpdated = localLastUpdated || lastUpdated;
    if (!effectiveLastUpdated) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - effectiveLastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return effectiveLastUpdated.toLocaleDateString();
  };

  const getPeriodLabel = (period: '3d' | '7d' | '30d') => {
    switch (period) {
      case '3d': return 'Last 3 days';
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      default: return 'Last 7 days';
    }
  };

  const currentlyLoading = isLoading || isRefreshing;

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/20 backdrop-blur-apple shadow-sm animate-slide-up">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Modern Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Apple-style app icon */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-7 w-7 text-blue-600" />
                </div>
                {/* Live indicator dot */}
                <div className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                  currentlyLoading ? "bg-amber-200 animate-pulse" : "bg-emerald-200 animate-glow"
                )} />
              </div>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
                  Autovana Analytics
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Real-Time Inventory & Market Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Status Indicators & Time Period Selector (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Sales Performance Time Period Selector */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50/70 border border-slate-200/50 backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  Sales: {getPeriodLabel(selectedPeriod)}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
                
                {/* Coming Soon Badge */}
                <Badge 
                  variant="secondary" 
                  className="ml-2 px-2 py-0.5 text-xs bg-amber-50 border-amber-200 text-amber-700"
                >
                  Coming Soon
                </Badge>
              </div>

              {/* Dropdown Menu (Hidden for now - Coming Soon) */}
              <div className="absolute top-full mt-2 left-0 hidden group-hover:block bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-48">
                <div className="p-2 space-y-1">
                  {(['3d', '7d', '30d'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => onPeriodChange?.(period)}
                      disabled={true} // Disabled for "Coming Soon"
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        "text-slate-400 cursor-not-allowed", // Disabled styling
                        selectedPeriod === period && "bg-slate-100"
                      )}
                    >
                      {getPeriodLabel(period)}
                      {selectedPeriod === period && (
                        <span className="ml-2 text-slate-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Status */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50/70 border border-slate-200/50 backdrop-blur-sm">
              <Activity className={cn(
                "h-4 w-4",
                currentlyLoading ? "text-amber-500 animate-pulse" : "text-emerald-500 animate-glow"
              )} />
              <span className="text-sm font-medium text-slate-700">
                {currentlyLoading ? 'Syncing Data...' : 'Live Analytics'}
              </span>
            </div>
            
            {/* Performance Badge */}
            <Badge 
              variant="secondary" 
              className="px-3 py-1 rounded-full bg-indigo-50/70 border border-indigo-100 text-xs font-medium text-indigo-600"
            >
              <Zap className="h-3 w-3 mr-1 text-indigo-500" />
              Real-time
            </Badge>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Last Updated Badge */}
            <Badge 
              variant="outline" 
              className={cn(
                "hidden sm:flex px-3 py-1 rounded-full border border-slate-200/50 text-xs text-slate-600 transition-all duration-500",
                justUpdated ? [
                  // Glowing state after refresh
                  "bg-emerald-50 border-emerald-200 text-emerald-700",
                  "shadow-md shadow-emerald-200/50 animate-glow",
                  "ring-2 ring-emerald-200/30"
                ] : [
                  // Default state
                  "bg-slate-50/50"
                ]
              )}
            >
              {justUpdated && (
                <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-pulse" />
              )}
              <span className="relative z-10">
                Updated {formatLastUpdated()}
              </span>
            </Badge>

            {/* Brandwise Analysis Link */}
            <Link to="/brandwise-analysis">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-3 py-2 h-10 rounded-xl text-slate-600",
                  "hover:bg-slate-100/50 hover:text-slate-700 transition-all duration-300",
                  "active:scale-95"
                )}
              >
                <BarChart3 className="h-4 w-4 mr-2 text-slate-500" />
                <span className="font-medium hidden md:inline">Brand Analysis</span>
              </Button>
            </Link>

            {/* Project Docs Link */}
            <Link to="/docs">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-3 py-2 h-10 rounded-xl text-slate-600",
                  "hover:bg-slate-100/50 hover:text-slate-700 transition-all duration-300",
                  "active:scale-95"
                )}
              >
                <FileText className="h-4 w-4 mr-2 text-slate-500" />
                <span className="font-medium hidden md:inline">Docs</span>
              </Button>
            </Link>

            {/* Apple-style refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={currentlyLoading}
              className={cn(
                "btn-apple px-4 py-2 h-10 rounded-xl border-2 transition-all duration-300",
                "focus:ring-2 focus:ring-emerald-200 shadow-sm relative overflow-hidden",
                currentlyLoading ? [
                  // Loading state styling
                  "border-emerald-300 bg-emerald-100 text-emerald-800",
                  "shadow-md animate-pulse cursor-not-allowed"
                ] : [
                  // Default state styling
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
                  "hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300",
                  "hover:shadow-md active:scale-95 active:shadow-lg",
                  "hover:animate-none active:animate-pulse"
                ]
              )}
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-2 transition-all duration-300",
                currentlyLoading ? [
                  "text-emerald-700 animate-spin"
                ] : [
                  "text-emerald-600 group-hover:text-emerald-700",
                  "hover:rotate-180 active:rotate-360"
                ]
              )} />
              <span className={cn(
                "font-medium transition-all duration-200 relative z-10",
                currentlyLoading && "animate-pulse"
              )}>
                {currentlyLoading ? 'Syncing...' : 'Refresh'}
              </span>
              
              {/* Visual feedback ripple effect */}
              {currentlyLoading && (
                <div className="absolute inset-0 rounded-xl bg-emerald-200/30 animate-ping opacity-75" />
              )}
              
              {/* Loading progress bar */}
              {isRefreshing && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-emerald-300/50 w-full">
                  <div className="h-full bg-emerald-400 animate-pulse rounded-full transition-all duration-1000 ease-out"
                       style={{ width: '100%' }} />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Status Row */}
        <div className="lg:hidden mt-3 flex items-center justify-between pt-3 border-t border-slate-200/50">
          <div className="flex items-center gap-3">
            <Activity className={cn(
              "h-4 w-4",
              currentlyLoading ? "text-amber-500 animate-pulse" : "text-emerald-500"
            )} />
            <span className="text-sm font-medium text-slate-700">
              {currentlyLoading ? 'Syncing...' : 'Live'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Sales Period Indicator */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50/70 border border-slate-200/50">
              <Calendar className="h-3 w-3 text-slate-500" />
              <span className="text-xs text-slate-600">{getPeriodLabel(selectedPeriod)}</span>
              <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs bg-amber-50 border-amber-200 text-amber-600">
                Soon
              </Badge>
            </div>
            
            <Badge 
              variant="secondary" 
              className={cn(
                "px-3 py-1 rounded-full border border-slate-200/50 text-xs text-slate-600 transition-all duration-500",
                justUpdated ? [
                  // Mobile glowing state after refresh
                  "bg-emerald-50/70 border-emerald-200 text-emerald-700",
                  "shadow-sm shadow-emerald-200/30 animate-glow"
                ] : [
                  // Default mobile state
                  "bg-slate-50/70"
                ]
              )}
            >
              {justUpdated && (
                <div className="absolute inset-0 rounded-full bg-emerald-100/30 animate-pulse" />
              )}
              <span className="relative z-10">
                {formatLastUpdated()}
              </span>
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}