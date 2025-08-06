import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DataTables } from "@/components/dashboard/DataTables";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ApiConfigDebug from "@/components/ApiConfigDebug";
import { 
  Car, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  AlertCircle
} from "lucide-react";

const Index = () => {
  const { data, isLoading, error, refetch } = useDashboardData();

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export functionality to be implemented');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dashboard-bg font-body">
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>
        
        <DashboardHeader 
          isLoading={false}
          onRefresh={handleRefresh}
        />
        
        <div className="relative container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert className="glass rounded-2xl border-0 shadow-card backdrop-blur-apple p-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-error/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-error" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Connection Error
                  </h3>
                  <AlertDescription className="text-muted-foreground text-base leading-relaxed">
                    Unable to connect to the Carvana Analytics API. Please ensure the backend service is running.
                    {error instanceof Error && (
                      <span className="block mt-2 text-sm font-mono text-error/80">
                        {error.message}
                      </span>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-dashboard-bg font-body">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        <DashboardHeader 
          isLoading={true}
          onRefresh={handleRefresh}
        />
        
        <div className="relative container mx-auto px-6 py-6">
          {/* KPI Cards Row - Apple-style loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <Skeleton className="h-40 rounded-3xl glass backdrop-blur-apple shadow-card" />
              </div>
            ))}
          </div>
          
          {/* Charts Grid - Daily Sales Trend + Brand Performance and Inventory Distribution */}
          <div className="space-y-6 mb-6">
            <Skeleton className="h-96 rounded-3xl glass backdrop-blur-apple shadow-card animate-fade-in" style={{ animationDelay: '400ms' }} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Skeleton className="h-96 rounded-3xl glass backdrop-blur-apple shadow-card animate-fade-in" style={{ animationDelay: '500ms' }} />
              <Skeleton className="h-96 rounded-3xl glass backdrop-blur-apple shadow-card animate-fade-in" style={{ animationDelay: '600ms' }} />
            </div>
          </div>
          
          {/* Tables Skeleton */}
          <Skeleton className="h-[500px] rounded-3xl glass backdrop-blur-apple shadow-card animate-fade-in" style={{ animationDelay: '700ms' }} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const kpiCards = [
    {
      title: "Active Inventory",
      value: data.kpis.total_active_inventory,
      icon: <Car className="h-7 w-7" />,
      gradient: "bg-gradient-primary",
      trend: { value: 2.4, isPositive: true },
      description: "Total vehicles available",
      color: "primary"
    },
    {
      title: "Sales Today", 
      value: data.kpis.total_sales_today,
      icon: <TrendingUp className="h-7 w-7" />,
      gradient: "bg-gradient-success",
      trend: { value: 8.1, isPositive: true },
      description: "Vehicles sold today",
      color: "success"
    },
    {
      title: "Avg. Days to Sell",
      value: Math.round(data.kpis.average_days_to_sell),
      icon: <Calendar className="h-7 w-7" />,
      gradient: "bg-gradient-warning", 
      trend: { value: -3.2, isPositive: true },
      description: "Market velocity",
      color: "warning"
    },
    {
      title: "Avg. Sale Price",
      value: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      }).format(data.kpis.average_sale_price),
      icon: <DollarSign className="h-7 w-7" />,
      gradient: "bg-gradient-info",
      trend: { value: 5.7, isPositive: true },
      description: "Revenue per vehicle",
      color: "info"
    }
  ];

  return (
    <div className="min-h-screen bg-dashboard-bg font-body overflow-x-hidden">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh opacity-40"></div>
      
      {/* Header with glass morphism */}
      <DashboardHeader 
        isLoading={isLoading}
        lastUpdated={new Date()}
        onRefresh={handleRefresh}
      />
      
      <main className="relative container mx-auto px-6 py-6 space-y-8">
        {/* Hero Section with KPI Cards */}
        <section className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpiCards.map((card, index) => (
              <div
                key={card.title}
                className="group"
                style={{ 
                  animationDelay: `${index * 150}ms` 
                }}
              >
                <KPICard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  gradient={card.gradient}
                  trend={card.trend}
                  description={card.description}
                  color={card.color}
                  className="animate-fade-in-up hover:scale-[1.02] transition-all duration-300 ease-apple h-full"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="space-y-6">
          {/* Daily Sales Trend + Brand Performance and Inventory Distribution */}
          <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <DashboardCharts
              dailySalesTrend={data.daily_sales_trend}
              inventoryByPriceRange={data.inventory_by_price_range}
              salesByBrand={data.sales_by_brand}
              daysOnLotByPriceRange={data.days_on_lot_by_price_range}
            />
          </div>
        </section>

        {/* Data Tables Section */}
        <section className="space-y-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <DataTables
              topSellingModels={data.top_selling_models}
              slowMovingInventory={data.slow_moving_inventory}
              recentSales={data.recent_sales}
            />
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-16"></div>
      </main>
      <ApiConfigDebug />
    </div>
  );
};

export default Index;
