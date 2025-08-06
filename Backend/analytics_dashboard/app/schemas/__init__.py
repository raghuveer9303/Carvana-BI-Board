from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date
from decimal import Decimal

class DimDateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    date_key: int
    full_date: date
    year: int
    quarter: int
    month: int
    month_name: str
    month_abbr: str
    day: int
    day_of_week: int
    day_name: str
    day_abbr: str
    week_of_year: int
    is_weekend: bool
    is_month_start: bool
    is_month_end: bool
    quarter_name: str
    year_month: str

class DimVehicleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    vehicle_key: int
    manufacturer: str
    model: str
    brand: Optional[str] = None
    color: Optional[str] = None
    created_at: Optional[date] = None

class DimPriceRangeSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    price_range_key: int
    range_name: str
    min_price: Decimal
    max_price: Decimal
    description: Optional[str] = None

class FactDailyInventorySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    date_key: int
    vehicle_key: Optional[int] = None
    price_range_key: Optional[int] = None
    vin: str
    price: Optional[Decimal] = None
    mileage: Optional[int] = None
    status: Optional[str] = None
    active_count: int = 0
    new_arrivals: int = 0
    sold_count: int = 0
    days_on_lot: int = 0
    
    # Related objects
    vehicle: Optional[DimVehicleSchema] = None
    price_range: Optional[DimPriceRangeSchema] = None

class FactSalesEventsSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    sale_date_key: int
    vehicle_key: Optional[int] = None
    vin: str
    sale_price: Optional[Decimal] = None
    sale_mileage: Optional[int] = None
    days_to_sell: int = 0
    added_date: Optional[date] = None
    sold_date: Optional[date] = None
    
    # Related objects
    vehicle: Optional[DimVehicleSchema] = None

# Dashboard specific schemas
class KPIResponse(BaseModel):
    total_active_inventory: int
    total_sales_today: int
    average_days_to_sell: float
    average_sale_price: float

class DailySalesTrendItem(BaseModel):
    date: date
    sales_count: int
    total_sales_amount: float

class InventoryByPriceRangeItem(BaseModel):
    price_range: str
    inventory_count: int
    percentage: float

class SalesByBrandItem(BaseModel):
    brand: str
    sales_count: int
    percentage: float
    avg_sale_price: float

class DaysOnLotByPriceRangeItem(BaseModel):
    price_range: str
    avg_days_on_lot: float

class TopSellingModelItem(BaseModel):
    manufacturer: str
    model: str
    brand: str
    units_sold: int
    avg_sale_price: float
    avg_days_to_sell: float

class SlowMovingInventoryItem(BaseModel):
    vin: str
    manufacturer: str
    model: str
    brand: str
    days_on_lot: int
    price: float

class RecentSaleItem(BaseModel):
    sale_date: date
    vin: str
    manufacturer: str
    model: str
    brand: str
    sale_price: float
    days_to_sell: int

class DashboardResponse(BaseModel):
    kpis: KPIResponse
    daily_sales_trend: List[DailySalesTrendItem]
    inventory_by_price_range: List[InventoryByPriceRangeItem]
    sales_by_brand: List[SalesByBrandItem]
    days_on_lot_by_price_range: List[DaysOnLotByPriceRangeItem]
    top_selling_models: List[TopSellingModelItem]
    slow_moving_inventory: List[SlowMovingInventoryItem]
    recent_sales: List[RecentSaleItem]
