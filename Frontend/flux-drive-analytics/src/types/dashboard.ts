export interface DashboardKPIs {
  total_active_inventory: number;
  total_sales_today: number;
  average_days_to_sell: number;
  average_sale_price: number;
}

export interface DailySalesTrend {
  date: string;
  sales_count: number;
  total_sales_amount: number;
}

export interface InventoryByPriceRange {
  price_range: string;
  inventory_count: number;
  percentage: number;
}

export interface SalesByBrand {
  brand: string;
  sales_count: number;
  percentage: number;
  avg_sale_price: number;
}

export interface DaysOnLotByPriceRange {
  price_range: string;
  avg_days_on_lot: number;
}

export interface TopSellingModel {
  manufacturer: string;
  model: string;
  brand: string;
  units_sold: number;
  avg_sale_price: number;
  avg_days_to_sell: number;
}

export interface SlowMovingInventory {
  vin: string;
  manufacturer: string;
  model: string;
  brand: string;
  days_on_lot: number;
  price: number;
}

export interface RecentSale {
  sale_date: string;
  vin: string;
  manufacturer: string;
  model: string;
  brand: string;
  sale_price: number;
  days_to_sell: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  daily_sales_trend: DailySalesTrend[];
  inventory_by_price_range: InventoryByPriceRange[];
  sales_by_brand: SalesByBrand[];
  days_on_lot_by_price_range: DaysOnLotByPriceRange[];
  top_selling_models: TopSellingModel[];
  slow_moving_inventory: SlowMovingInventory[];
  recent_sales: RecentSale[];
}

export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}