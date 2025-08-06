import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { cn } from "@/lib/utils";
import { 
  DailySalesTrend, 
  InventoryByPriceRange, 
  SalesByBrand, 
  DaysOnLotByPriceRange
} from "@/types/dashboard";
import { TrendingUp, Package, Target, Clock } from "lucide-react";

interface DashboardChartsProps {
  dailySalesTrend: DailySalesTrend[];
  inventoryByPriceRange: InventoryByPriceRange[];
  salesByBrand: SalesByBrand[];
  daysOnLotByPriceRange: DaysOnLotByPriceRange[];
}

interface TopChartsProps {
  dailySalesTrend: DailySalesTrend[];
  inventoryByPriceRange: InventoryByPriceRange[];
  salesByBrand: SalesByBrand[];
}

interface BottomChartProps {
  daysOnLotByPriceRange: DaysOnLotByPriceRange[];
}

// Apple-inspired custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Format the date label
    const formatDate = (dateValue: string) => {
      try {
        const date = new Date(dateValue);
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch {
        return dateValue;
      }
    };

    return (
      <div className="glass rounded-2xl border-0 p-4 shadow-glass backdrop-blur-apple">
        <p className="font-display font-semibold text-foreground mb-2">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 py-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {typeof entry.value === 'number' && entry.name.includes('Revenue') 
                ? `$${entry.value.toLocaleString()}` 
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Modern color palette inspired by Apple and Google
const chartColors = {
  primary: '#4F46E5',      // Indigo
  success: '#059669',      // Emerald
  warning: '#D97706',      // Amber
  info: '#0284C7',         // Sky
  purple: '#7C3AED',       // Violet
  pink: '#DB2777',         // Pink
  orange: '#EA580C',       // Orange
  teal: '#0D9488',         // Teal
  gray: '#6B7280',         // Gray
  slate: '#475569'         // Slate
};

const brandColors = [
  chartColors.primary,
  chartColors.success, 
  chartColors.warning,
  chartColors.info,
  chartColors.purple,
  chartColors.pink,
  chartColors.orange,
  chartColors.teal,
  chartColors.gray,
  chartColors.slate
];

export function TopCharts({
  dailySalesTrend,
  inventoryByPriceRange,
  salesByBrand
}: TopChartsProps) {
  return (
    <div className="space-y-6">
      {/* Daily Sales Trend - Premium Area Chart */}
      <Card className="glass rounded-3xl border-0 shadow-card backdrop-blur-apple hover:shadow-hover transition-all duration-500 group">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-display font-bold text-foreground">
                Sales Performance Timeline
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Daily sales volume and revenue trends over the past 30 days
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={dailySalesTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColors.success} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="volume"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="revenue"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="volume"
                type="monotone"
                dataKey="sales_count"
                stroke={chartColors.primary}
                strokeWidth={3}
                fill="url(#salesGradient)"
                dot={{ fill: chartColors.primary, strokeWidth: 2, r: 5 }}
                name="Sales Count"
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="total_sales_amount"
                stroke={chartColors.success}
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ fill: chartColors.success, strokeWidth: 2, r: 5 }}
                name="Total Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Brand Performance and Inventory Distribution - Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales by Brand - Modern Donut Chart */}
        <Card className="glass rounded-3xl border-0 shadow-card backdrop-blur-apple hover:shadow-hover transition-all duration-500 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-success/10 text-success">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-bold text-foreground">
                  Brand Performance
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Market share distribution by manufacturer
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={salesByBrand}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="sales_count"
                >
                  {salesByBrand.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={brandColors[index % brandColors.length]}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass rounded-2xl border-0 p-4 shadow-glass backdrop-blur-apple">
                          <p className="font-display font-semibold text-foreground mb-2">{data.brand}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Sales: <span className="font-semibold text-foreground">{data.sales_count}</span></p>
                            <p className="text-sm text-muted-foreground">Share: <span className="font-semibold text-foreground">{data.percentage}%</span></p>
                            <p className="text-sm text-muted-foreground">Avg Price: <span className="font-semibold text-foreground">${data.avg_sale_price?.toLocaleString()}</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {salesByBrand.slice(0, 6).map((entry, index) => (
                <div key={entry.brand} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: brandColors[index % brandColors.length] }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {entry.brand} ({entry.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory by Price Range - Modern Bar Chart */}
        <Card className="glass rounded-3xl border-0 shadow-card backdrop-blur-apple hover:shadow-hover transition-all duration-500 group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-info/10 text-info">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-display font-bold text-foreground">
                  Inventory Distribution
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  Active inventory by price segments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={inventoryByPriceRange} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.info} stopOpacity={1}/>
                    <stop offset="100%" stopColor={chartColors.info} stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="price_range" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass rounded-2xl border-0 p-4 shadow-glass backdrop-blur-apple">
                          <p className="font-display font-semibold text-foreground mb-2">{label}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Count: <span className="font-semibold text-foreground">{data.inventory_count}</span></p>
                            <p className="text-sm text-muted-foreground">Share: <span className="font-semibold text-foreground">{data.percentage}%</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="inventory_count" 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Inventory Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function BottomChart({ daysOnLotByPriceRange }: BottomChartProps) {
  return (
    <Card className="glass rounded-3xl border-0 shadow-card backdrop-blur-apple hover:shadow-hover transition-all duration-500 group">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-warning/10 text-warning">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-display font-bold text-foreground">
              Market Velocity Analysis
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Average days on lot by price range - optimized for quick turnover
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={daysOnLotByPriceRange} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="daysGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.warning} stopOpacity={1}/>
                <stop offset="100%" stopColor={chartColors.warning} stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="price_range" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass rounded-2xl border-0 p-4 shadow-glass backdrop-blur-apple">
                      <p className="font-display font-semibold text-foreground mb-2">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        Average Days: <span className="font-semibold text-foreground">{Math.round(payload[0].value as number)} days</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="avg_days_on_lot" 
              fill="url(#daysGradient)"
              radius={[8, 8, 0, 0]}
              name="Average Days"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DashboardCharts({
  dailySalesTrend,
  inventoryByPriceRange,
  salesByBrand,
  daysOnLotByPriceRange
}: DashboardChartsProps) {
  return (
    <TopCharts
      dailySalesTrend={dailySalesTrend}
      inventoryByPriceRange={inventoryByPriceRange}
      salesByBrand={salesByBrand}
    />
  );
}
