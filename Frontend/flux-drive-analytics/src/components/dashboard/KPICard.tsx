import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
  description?: string;
  color?: string;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  icon, 
  trend, 
  gradient, 
  description,
  color = "primary",
  className 
}: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (title.includes('Price') || title.includes('Revenue')) {
        return `$${val.toLocaleString()}`;
      }
      if (title.includes('Days')) {
        return `${val.toFixed(1)} days`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value === 0) return <Minus className="h-4 w-4" />;
    return trend.isPositive ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return {
          iconBg: 'bg-success/10 text-success border-success/20',
          trendBg: 'bg-success/5',
          valueGradient: 'text-gradient-success'
        };
      case 'warning':
        return {
          iconBg: 'bg-warning/10 text-warning border-warning/20',
          trendBg: 'bg-warning/5',
          valueGradient: 'text-gradient-warning'
        };
      case 'info':
        return {
          iconBg: 'bg-info/10 text-info border-info/20',
          trendBg: 'bg-info/5',
          valueGradient: 'text-gradient-info'
        };
      default:
        return {
          iconBg: 'bg-primary/10 text-primary border-primary/20',
          trendBg: 'bg-primary/5',
          valueGradient: 'text-gradient-primary'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <Card className={cn(
      // Apple-inspired glass morphism
      "glass rounded-3xl border-0 shadow-card backdrop-blur-apple",
      "hover:shadow-hover transition-all duration-300 ease-apple",
      "group hover:scale-[1.02] hover:-translate-y-1",
      // Height and layout
      "h-full min-h-[180px]",
      className
    )}>
      <CardContent className="p-8 h-full">
        <div className="flex flex-col h-full space-y-6">
          {/* Header with Icon and Trend */}
          <div className="flex items-start justify-between">
            {/* Apple-style icon container */}
            <div className={cn(
              "p-4 rounded-2xl border backdrop-blur-sm",
              "transition-all duration-300 group-hover:scale-110",
              colorClasses.iconBg
            )}>
              {icon}
            </div>

            {/* Google Material-style trend indicator */}
            {trend && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full",
                "border backdrop-blur-sm transition-all duration-300",
                colorClasses.trendBg,
                trend.isPositive ? "border-success/20" : "border-destructive/20"
              )}>
                {getTrendIcon()}
                <span className={cn(
                  "font-semibold text-sm",
                  trend.isPositive ? "text-success" : "text-destructive",
                  trend.value === 0 && "text-muted-foreground"
                )}>
                  {trend.value > 0 && '+'}
                  {trend.value.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Value - Large and prominent */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            <div className={cn(
              "text-4xl md:text-5xl font-display font-bold leading-none",
              "transition-all duration-300 group-hover:scale-105",
              colorClasses.valueGradient
            )}>
              {formatValue(value)}
            </div>
          </div>

          {/* Footer with title and description */}
          <div className="space-y-1">
            <h3 className="text-lg font-display font-semibold text-foreground leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Subtle hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20",
          "transition-opacity duration-500 pointer-events-none", 
          gradient
        )} />
      </CardContent>
    </Card>
  );
}