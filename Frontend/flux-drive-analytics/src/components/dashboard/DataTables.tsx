import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  TopSellingModel, 
  SlowMovingInventory, 
  RecentSale 
} from "@/types/dashboard";
import { TrendingUp, AlertTriangle, Clock, Trophy, Car, Calendar } from "lucide-react";

interface DataTablesProps {
  topSellingModels: TopSellingModel[];
  slowMovingInventory: SlowMovingInventory[];
  recentSales: RecentSale[];
}

export function DataTables({ 
  topSellingModels, 
  slowMovingInventory, 
  recentSales 
}: DataTablesProps) {
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

  const getPerformanceBadge = (daysToSell: number) => {
    if (daysToSell <= 15) return { variant: 'default' as const, color: 'success', label: 'Fast' };
    if (daysToSell <= 30) return { variant: 'secondary' as const, color: 'info', label: 'Good' };
    if (daysToSell <= 45) return { variant: 'outline' as const, color: 'warning', label: 'Slow' };
    return { variant: 'destructive' as const, color: 'error', label: 'Critical' };
  };

  return (
    <Card className="glass rounded-3xl border-0 shadow-card backdrop-blur-apple overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-display font-bold text-foreground">
          Detailed Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="top-selling" className="w-full">
          {/* Apple-style tab navigation */}
          <div className="px-6 pb-4">
            <TabsList className="glass rounded-2xl p-1 w-full grid grid-cols-3 backdrop-blur-apple border-0">
              <TabsTrigger 
                value="top-selling" 
                className="rounded-xl px-4 py-3 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Top Performers
              </TabsTrigger>
              <TabsTrigger 
                value="slow-moving" 
                className="rounded-xl px-4 py-3 text-sm font-medium transition-all data-[state=active]:bg-warning data-[state=active]:text-warning-foreground data-[state=active]:shadow-md"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Slow Movers
              </TabsTrigger>
              <TabsTrigger 
                value="recent-sales" 
                className="rounded-xl px-4 py-3 text-sm font-medium transition-all data-[state=active]:bg-success data-[state=active]:text-success-foreground data-[state=active]:shadow-md"
              >
                <Clock className="h-4 w-4 mr-2" />
                Recent Sales
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Top Selling Models */}
          <TabsContent value="top-selling" className="mt-0">
            <div className="px-6 pb-6">
              <div className="glass rounded-2xl overflow-hidden backdrop-blur-apple">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/20 bg-muted/20">
                        <th className="text-left p-4 text-sm font-display font-semibold text-foreground">Vehicle</th>
                        <th className="text-left p-4 text-sm font-display font-semibold text-foreground">Brand</th>
                        <th className="text-center p-4 text-sm font-display font-semibold text-foreground">Units Sold</th>
                        <th className="text-right p-4 text-sm font-display font-semibold text-foreground">Avg Price</th>
                        <th className="text-right p-4 text-sm font-display font-semibold text-foreground">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingModels.map((model, index) => (
                        <tr 
                          key={`${model.manufacturer}-${model.model}-${index}`}
                          className="border-b border-border/10 hover:bg-muted/20 transition-all duration-200 group"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Car className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-foreground">{model.manufacturer}</p>
                                <p className="text-sm text-muted-foreground">{model.model}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                              {model.brand}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-success/10 text-success">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-display font-bold text-lg">{model.units_sold}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-mono font-semibold text-foreground text-lg">
                              {formatCurrency(model.avg_sale_price)}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex flex-col items-end gap-1">
                              <Badge 
                                variant={getPerformanceBadge(model.avg_days_to_sell).variant}
                                className="rounded-full px-3 py-1 text-xs font-medium"
                              >
                                {model.avg_days_to_sell.toFixed(1)} days
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {getPerformanceBadge(model.avg_days_to_sell).label}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Slow Moving Inventory */}
          <TabsContent value="slow-moving" className="mt-0">
            <div className="px-6 pb-6">
              <div className="glass rounded-2xl overflow-hidden backdrop-blur-apple">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/20 bg-warning/5">
                        <th className="text-left p-4 text-sm font-display font-semibold text-foreground">VIN</th>
                        <th className="text-left p-4 text-sm font-display font-semibold text-foreground">Vehicle</th>
                        <th className="text-center p-4 text-sm font-display font-semibold text-foreground">Days on Lot</th>
                        <th className="text-right p-4 text-sm font-display font-semibold text-foreground">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slowMovingInventory.map((vehicle, index) => (
                        <tr 
                          key={vehicle.vin}
                          className="border-b border-border/10 hover:bg-warning/5 transition-all duration-200 group"
                        >
                          <td className="p-4">
                            <span className="font-mono text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-lg">
                              {vehicle.vin}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-warning/10 text-warning">
                                <AlertTriangle className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-foreground">{vehicle.manufacturer}</p>
                                <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge 
                              variant={vehicle.days_on_lot > 60 ? "destructive" : "outline"}
                              className={cn(
                                "rounded-full px-4 py-2 text-sm font-bold",
                                vehicle.days_on_lot > 60 && "animate-pulse"
                              )}
                            >
                              {vehicle.days_on_lot} days
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-mono font-semibold text-foreground text-lg">
                              {formatCurrency(vehicle.price)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Recent Sales */}
          <TabsContent value="recent-sales" className="mt-0">
            <div className="px-6 pb-6">
              <div className="glass rounded-2xl overflow-hidden backdrop-blur-apple">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/20 bg-success/5">
                        <th className="text-left p-4 text-sm font-display font-semibold text-foreground">Sale Date</th>
                        <th className="text-left p-4 text-sm font-display font-semibold text-foreground">Vehicle</th>
                        <th className="text-center p-4 text-sm font-display font-semibold text-foreground">VIN</th>
                        <th className="text-right p-4 text-sm font-display font-semibold text-foreground">Sale Price</th>
                        <th className="text-right p-4 text-sm font-display font-semibold text-foreground">Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale, index) => (
                        <tr 
                          key={`${sale.vin}-${sale.sale_date}`}
                          className="border-b border-border/10 hover:bg-success/5 transition-all duration-200 group"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{formatDate(sale.sale_date)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-success/10 text-success">
                                <Car className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-foreground">{sale.manufacturer}</p>
                                <p className="text-sm text-muted-foreground">{sale.model}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-mono text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-lg">
                              {sale.vin}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-mono font-semibold text-foreground text-lg">
                              {formatCurrency(sale.sale_price)}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Badge 
                              variant={getPerformanceBadge(sale.days_to_sell).variant}
                              className="rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {sale.days_to_sell} days
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
