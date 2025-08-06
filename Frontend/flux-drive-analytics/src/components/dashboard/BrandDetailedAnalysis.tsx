import React, { useState, useMemo } from 'react';
import { DetailedBrandAnalysis } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Car, 
  Calendar,
  Clock,
  Target,
  Award,
  Zap,
  Search,
  Filter,
  Download,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface BrandDetailedAnalysisProps {
  data: DetailedBrandAnalysis;
  onBack: () => void;
}

const BrandDetailedAnalysis: React.FC<BrandDetailedAnalysisProps> = ({ data, onBack }) => {
  const { basic_metrics, sales_by_model, price_distribution, sales_trend, inventory_age } = data;
  
  // State for table filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  
  // Calculate totals for percentage calculations
  const totalRevenue = sales_by_model.reduce((sum, model) => sum + model.total_revenue, 0);
  const totalSales = sales_by_model.reduce((sum, model) => sum + model.sales_count, 0);
  const totalInventory = price_distribution.reduce((sum, range) => sum + range.inventory_count, 0);

  // Chart colors
  const chartColors = {
    primary: '#4F46E5',
    success: '#059669',
    warning: '#D97706',
    info: '#0284C7',
    purple: '#7C3AED',
    pink: '#DB2777',
    orange: '#EA580C',
    teal: '#0D9488'
  };

  const brandColors = [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.info,
    chartColors.purple,
    chartColors.pink,
    chartColors.orange,
    chartColors.teal
  ];

  // Filtered data for table
  const filteredData = useMemo(() => {
    let filtered = sales_by_model;
    
    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [sales_by_model, searchTerm]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-2xl border-0 p-4 shadow-glass backdrop-blur-apple">
          <p className="font-display font-semibold text-foreground mb-2">{label}</p>
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
                {typeof entry.value === 'number' && entry.name.includes('Price') 
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Overview</span>
        </button>
      </div>

      {/* Basic Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              <Car className="h-4 w-4" />
              <span>Total Inventory</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-foreground">
              {basic_metrics.total_vehicles.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current vehicles in stock</p>
          </CardContent>
        </Card>

        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Avg Price</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-foreground">
              ${basic_metrics.average_price.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average vehicle price</p>
          </CardContent>
        </Card>

        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>30-Day Sales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-foreground">
              {basic_metrics.total_sales_30_days}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${basic_metrics.total_revenue_30_days.toLocaleString()} revenue
            </p>
          </CardContent>
        </Card>

        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Avg Days to Sell</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-foreground">
              {Math.round(basic_metrics.avg_days_to_sell)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average time on lot</p>
          </CardContent>
        </Card>
      </div>

      {/* Four Meaningful Charts with Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sales Trend Over Time with Insights */}
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChartIcon className="h-5 w-5" />
              <span>Sales Trend (90 Days)</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              📈 <strong>Insight:</strong> {sales_trend.length > 0 ? 
                `Average ${(sales_trend.reduce((sum, item) => sum + item.sales_count, 0) / sales_trend.length).toFixed(1)} sales per week. ` +
                (sales_trend[sales_trend.length - 1]?.sales_count > sales_trend[0]?.sales_count ? 
                  'Trending upward - strong market demand.' : 
                  'Consider promotional strategies to boost sales.')
                : 'No trend data available.'}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sales_trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="week_start" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (!value) return '';
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales_count"
                  stroke={chartColors.primary}
                  strokeWidth={3}
                  fill="url(#salesTrendGradient)"
                  dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  name="Sales Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Price Distribution with Market Analysis */}
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Price Distribution & Market Position</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              💰 <strong>Insight:</strong> {price_distribution.length > 0 ? 
                `Market positioning shows ${price_distribution.find(p => p.inventory_count === Math.max(...price_distribution.map(p => p.inventory_count)))?.price_range} segment dominates. ` +
                (price_distribution.find(p => p.price_range.includes('$50k'))?.inventory_count > 0 ? 
                  'Premium segment strong - consider luxury marketing.' : 
                  'Focus on mid-range market optimization.')
                : 'No price data available.'}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={price_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="inventory_count"
                >
                  {price_distribution.map((entry, index) => (
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
                          <p className="font-display font-semibold text-foreground mb-2">{data.price_range}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Inventory: <span className="font-semibold text-foreground">{data.inventory_count}</span></p>
                            <p className="text-sm text-muted-foreground">Share: <span className="font-semibold text-foreground">{((data.inventory_count / totalInventory) * 100).toFixed(1)}%</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {price_distribution.slice(0, 6).map((entry, index) => (
                <div key={entry.price_range} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: brandColors[index % brandColors.length] }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {entry.price_range} ({((entry.inventory_count / totalInventory) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Sales by Model with Performance Analysis */}
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChartIcon className="h-5 w-5" />
              <span>Model Performance Analysis</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              🏆 <strong>Insight:</strong> {sales_by_model.length > 0 ? 
                `Top performer: ${sales_by_model[0]?.model} with ${sales_by_model[0]?.sales_count} sales. ` +
                `Revenue concentration: ${((sales_by_model[0]?.total_revenue / totalRevenue) * 100).toFixed(1)}% of total revenue. ` +
                (sales_by_model.length > 3 ? 'Consider expanding top-performing models.' : 'Focus on model diversification.')
                : 'No model data available.'}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sales_by_model.slice(0, 8)} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="modelSalesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.success} stopOpacity={1}/>
                    <stop offset="100%" stopColor={chartColors.success} stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="model" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                            <p className="text-sm text-muted-foreground">Sales: <span className="font-semibold text-foreground">{data.sales_count}</span></p>
                            <p className="text-sm text-muted-foreground">Revenue: <span className="font-semibold text-foreground">${data.total_revenue.toLocaleString()}</span></p>
                            <p className="text-sm text-muted-foreground">Avg Price: <span className="font-semibold text-foreground">${data.avg_price.toLocaleString()}</span></p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="sales_count" 
                  fill="url(#modelSalesGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Sales Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Inventory Age Analysis with Turnover Insights */}
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Inventory Turnover Analysis</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2">
              ⏱️ <strong>Insight:</strong> {inventory_age.length > 0 ? 
                `Turnover rate: ${inventory_age.find(a => a.age_group.includes('0-30'))?.inventory_count || 0} vehicles (0-30 days). ` +
                (inventory_age.find(a => a.age_group.includes('90+'))?.inventory_count > 0 ? 
                  `${inventory_age.find(a => a.age_group.includes('90+'))?.inventory_count} vehicles aging 90+ days - consider pricing strategies.` : 
                  'Healthy turnover - inventory moving well.')
                : 'No age data available.'}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventory_age} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="ageAnalysisGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.warning} stopOpacity={1}/>
                    <stop offset="100%" stopColor={chartColors.warning} stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="age_group" 
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
                      return (
                        <div className="glass rounded-2xl border-0 p-4 shadow-glass backdrop-blur-apple">
                          <p className="font-display font-semibold text-foreground mb-2">{label}</p>
                          <p className="text-sm text-muted-foreground">
                            Inventory: <span className="font-semibold text-foreground">{payload[0].value} vehicles</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="inventory_count" 
                  fill="url(#ageAnalysisGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Inventory Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table with Filters and Search */}
      <Card className="glass backdrop-blur-apple shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Detailed Sales Data</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Sales Count</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Total Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Avg Days to Sell</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue Share</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((model, index) => (
                  <tr key={model.model} className="border-b border-border/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="font-medium text-foreground">{model.model}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{model.sales_count}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">${model.avg_price.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">${model.total_revenue.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{Math.round(model.avg_days_to_sell)} days</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(model.total_revenue / totalRevenue) * 100} 
                          className="w-20 h-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          {((model.total_revenue / totalRevenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/20">
            <div className="text-center p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
              <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-foreground">
                {sales_by_model.length > 0 ? sales_by_model[0].model : 'N/A'}
              </div>
              <p className="text-sm text-muted-foreground">Top Selling Model</p>
            </div>
            
            <div className="text-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-foreground">
                ${basic_metrics.total_revenue_30_days > 0 ? 
                  (basic_metrics.total_revenue_30_days / basic_metrics.total_sales_30_days).toLocaleString() : 
                  '0'}
              </div>
              <p className="text-sm text-muted-foreground">Avg Revenue per Sale</p>
            </div>
            
            <div className="text-center p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-display font-bold text-foreground">
                {basic_metrics.total_sales_30_days > 0 ? 
                  Math.round(basic_metrics.total_sales_30_days / 30) : 
                  '0'}
              </div>
              <p className="text-sm text-muted-foreground">Daily Sales Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandDetailedAnalysis; 