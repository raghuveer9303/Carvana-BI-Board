import React from 'react';
import { DetailedBrandAnalysis } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Zap
} from 'lucide-react';

interface BrandDetailedAnalysisProps {
  data: DetailedBrandAnalysis;
  onBack: () => void;
}

const BrandDetailedAnalysis: React.FC<BrandDetailedAnalysisProps> = ({ data, onBack }) => {
  const { basic_metrics, sales_by_model, price_distribution, sales_trend, inventory_age } = data;
  
  // Calculate total revenue for percentage calculations
  const totalRevenue = sales_by_model.reduce((sum, model) => sum + model.total_revenue, 0);
  const totalSales = sales_by_model.reduce((sum, model) => sum + model.sales_count, 0);
  const totalInventory = price_distribution.reduce((sum, range) => sum + range.inventory_count, 0);

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

      {/* Sales Breakdown by Model */}
      <Card className="glass backdrop-blur-apple shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Sales Breakdown by Model</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales_by_model.map((model, index) => (
              <div key={model.model} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{model.model}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{model.sales_count} sales</span>
                        <span>${model.avg_price.toLocaleString()} avg</span>
                        <span>{Math.round(model.avg_days_to_sell)} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      ${model.total_revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((model.total_revenue / totalRevenue) * 100).toFixed(1)}% of revenue
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(model.sales_count / totalSales) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution */}
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Price Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {price_distribution.map((range, index) => (
                <div key={range.price_range} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{range.price_range}</span>
                    <span className="text-sm text-muted-foreground">
                      {range.inventory_count} vehicles
                    </span>
                  </div>
                  <Progress 
                    value={(range.inventory_count / totalInventory) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Age Analysis */}
        <Card className="glass backdrop-blur-apple shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Inventory Age Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventory_age.map((age, index) => {
                const colors = [
                  'bg-green-500',
                  'bg-blue-500', 
                  'bg-yellow-500',
                  'bg-orange-500',
                  'bg-red-500',
                  'bg-purple-500'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={age.age_group} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{age.age_group}</span>
                      <span className="text-sm text-muted-foreground">
                        {age.inventory_count} vehicles
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(age.inventory_count / totalInventory) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card className="glass backdrop-blur-apple shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Sales Trend (Last 90 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales_trend.map((week, index) => (
              <div key={week.week_start || index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {week.week_start ? new Date(week.week_start).toLocaleDateString() : `Week ${index + 1}`}
                  </span>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-muted-foreground">{week.sales_count} sales</span>
                    <span className="text-muted-foreground">${week.avg_price.toLocaleString()} avg</span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(week.sales_count / Math.max(...sales_trend.map(w => w.sales_count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="glass backdrop-blur-apple shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Performance Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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