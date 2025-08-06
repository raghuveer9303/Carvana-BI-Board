from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, case, text
from typing import List
from datetime import date, datetime, timedelta
import logging

from .database import get_db
from .config import settings
from .models import (
    DimDate, DimVehicle, DimPriceRange, 
    FactDailyInventory, FactSalesEvents
)
from .schemas import (
    DashboardResponse, KPIResponse, DailySalesTrendItem,
    InventoryByPriceRangeItem, SalesByBrandItem, DaysOnLotByPriceRangeItem,
    TopSellingModelItem, SlowMovingInventoryItem, RecentSaleItem
)

app = FastAPI(
    title="Autovana Analytics Dashboard API",
    description="Analytics API for Autovana used car website vehicle inventory and sales data",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    return {"message": "Autovana Analytics Dashboard API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/api/debug")
async def debug_data(db: Session = Depends(get_db)):
    """Debug endpoint to check data availability"""
    try:
        # Check date ranges
        min_inventory_date = db.query(func.min(FactDailyInventory.date_key)).scalar()
        max_inventory_date = db.query(func.max(FactDailyInventory.date_key)).scalar()
        
        min_sales_date = db.query(func.min(FactSalesEvents.sale_date_key)).scalar()
        max_sales_date = db.query(func.max(FactSalesEvents.sale_date_key)).scalar()
        
        # Count records
        inventory_count = db.query(func.count(FactDailyInventory.vin)).scalar()
        sales_count = db.query(func.count(FactSalesEvents.vin)).scalar()
        vehicle_count = db.query(func.count(DimVehicle.vehicle_key)).scalar()
        price_range_count = db.query(func.count(DimPriceRange.price_range_key)).scalar()
        
        # Current inventory - count distinct VINs where status = 'active' (no date filter)
        today_key = int(date.today().strftime("%Y%m%d"))
        current_inventory = db.query(func.count(func.distinct(FactDailyInventory.vin))).filter(
            FactDailyInventory.status == 'active'
        ).scalar() or 0
        
        # Most recent inventory (for comparison)
        recent_inventory = db.query(func.count(func.distinct(FactDailyInventory.vin))).filter(
            FactDailyInventory.date_key == max_inventory_date,
            FactDailyInventory.status == 'active'
        ).scalar() or 0 if max_inventory_date else 0
        
        return {
            "today_key": today_key,
            "inventory_date_range": {"min": min_inventory_date, "max": max_inventory_date},
            "sales_date_range": {"min": min_sales_date, "max": max_sales_date},
            "record_counts": {
                "inventory": inventory_count,
                "sales": sales_count,
                "vehicles": vehicle_count,
                "price_ranges": price_range_count
            },
            "inventory_summary": {
                "today": current_inventory,
                "most_recent": recent_inventory
            }
        }
    except Exception as e:
        logger.error(f"Debug endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test-sales-by-brand")
async def test_sales_by_brand(db: Session = Depends(get_db)):
    """Test endpoint to debug sales by brand data"""
    try:
        today = date.today()
        today_key = int(today.strftime("%Y%m%d"))
        thirty_days_ago = today - timedelta(days=30)
        thirty_days_ago_key = int(thirty_days_ago.strftime("%Y%m%d"))
        
        # Get raw sales by brand data
        sales_by_brand = await get_sales_by_brand(db, thirty_days_ago_key, today_key)
        
        # Also get the raw SQL results for debugging
        raw_results = db.query(
            DimVehicle.brand,
            func.count(FactSalesEvents.vin).label('sales_count'),
            func.avg(FactSalesEvents.sale_price).label('avg_sale_price')
        ).join(
            FactSalesEvents, DimVehicle.vehicle_key == FactSalesEvents.vehicle_key
        ).group_by(
            DimVehicle.brand
        ).order_by(
            desc(func.count(FactSalesEvents.vin))
        ).limit(5).all()
        
        raw_data = [
            {
                "brand": result.brand,
                "sales_count": result.sales_count,
                "avg_sale_price": float(result.avg_sale_price or 0)
            }
            for result in raw_results
        ]
        
        return {
            "processed_data": sales_by_brand,
            "raw_sql_data": raw_data,
            "date_range": {
                "start": thirty_days_ago_key,
                "end": today_key
            }
        }
    except Exception as e:
        logger.error(f"Test sales by brand error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard", response_model=DashboardResponse)
async def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Get all dashboard data including KPIs, charts, and tables
    Data is returned with a 2-day lag (shows data up to 2 days ago)
    """
    try:
        # Apply 2-day lag to data - show data up to 2 days ago instead of today
        today = date.today() - timedelta(days=2)  # 2-day lag
        today_key = int(today.strftime("%Y%m%d"))
        thirty_days_ago = today - timedelta(days=30)
        thirty_days_ago_key = int(thirty_days_ago.strftime("%Y%m%d"))
        
        # Get KPIs
        kpis = await get_kpis(db, today_key)
        
        # Get chart data
        daily_sales_trend = await get_daily_sales_trend(db, thirty_days_ago_key, today_key)
        inventory_by_price_range = await get_inventory_by_price_range(db, today_key)
        sales_by_brand = await get_sales_by_brand(db, thirty_days_ago_key, today_key)
        days_on_lot_by_price_range = await get_days_on_lot_by_price_range(db, today_key)
        
        # Get table data
        top_selling_models = await get_top_selling_models(db, thirty_days_ago_key, today_key)
        slow_moving_inventory = await get_slow_moving_inventory(db, today_key)
        recent_sales = await get_recent_sales(db, today_key)
        
        return DashboardResponse(
            kpis=kpis,
            daily_sales_trend=daily_sales_trend,
            inventory_by_price_range=inventory_by_price_range,
            sales_by_brand=sales_by_brand,
            days_on_lot_by_price_range=days_on_lot_by_price_range,
            top_selling_models=top_selling_models,
            slow_moving_inventory=slow_moving_inventory,
            recent_sales=recent_sales
        )
    except Exception as e:
        logger.error(f"Error getting dashboard data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/brand/{brand_name}")
async def get_brand_metrics(brand_name: str, db: Session = Depends(get_db)):
    """Get detailed metrics for a specific brand"""
    try:
        # Get the most recent inventory date
        most_recent_date = db.query(func.max(FactDailyInventory.date_key)).scalar()
        
        # Calculate 30 days ago (with 2-day lag)
        today = date.today() - timedelta(days=2)  # 2-day lag
        thirty_days_ago = today - timedelta(days=30)
        thirty_days_ago_key = int(thirty_days_ago.strftime("%Y%m%d"))
        
        # Total vehicles for this brand (most recent date)
        total_vehicles = db.query(func.count(func.distinct(FactDailyInventory.vin))).filter(
            FactDailyInventory.date_key == most_recent_date,
            DimVehicle.brand == brand_name
        ).join(
            DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        # Average price for this brand (most recent date)
        avg_price = db.query(func.avg(FactDailyInventory.price)).filter(
            FactDailyInventory.date_key == most_recent_date,
            DimVehicle.brand == brand_name,
            FactDailyInventory.price.isnot(None),
            FactDailyInventory.price > 0
        ).join(
            DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        # Total sales for this brand in last 30 days
        total_sales_30_days = db.query(func.count(FactSalesEvents.vin)).filter(
            FactSalesEvents.sale_date_key >= thirty_days_ago_key,
            FactSalesEvents.sale_date_key <= int(today.strftime("%Y%m%d")),
            DimVehicle.brand == brand_name
        ).join(
            DimVehicle, FactSalesEvents.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        # Average days to sell for this brand (last 30 days)
        avg_days_to_sell = db.query(func.avg(FactSalesEvents.days_to_sell)).filter(
            FactSalesEvents.sale_date_key >= thirty_days_ago_key,
            FactSalesEvents.sale_date_key <= int(today.strftime("%Y%m%d")),
            DimVehicle.brand == brand_name,
            FactSalesEvents.days_to_sell > 0,
            FactSalesEvents.days_to_sell <= 365
        ).join(
            DimVehicle, FactSalesEvents.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        # Get top models for this brand
        top_models = db.query(
            DimVehicle.model,
            func.count(FactSalesEvents.vin).label('sales_count'),
            func.avg(FactSalesEvents.sale_price).label('avg_price')
        ).join(
            FactSalesEvents, DimVehicle.vehicle_key == FactSalesEvents.vehicle_key
        ).filter(
            FactSalesEvents.sale_date_key >= thirty_days_ago_key,
            FactSalesEvents.sale_date_key <= int(today.strftime("%Y%m%d")),
            DimVehicle.brand == brand_name
        ).group_by(
            DimVehicle.model
        ).order_by(
            desc(func.count(FactSalesEvents.vin))
        ).limit(5).all()
        
        return {
            "brand_name": brand_name,
            "total_vehicles": total_vehicles,
            "average_price": float(avg_price),
            "total_sales_30_days": total_sales_30_days,
            "avg_days_to_sell": float(avg_days_to_sell),
            "top_models": [
                {
                    "model": result.model,
                    "sales_count": result.sales_count,
                    "avg_price": float(result.avg_price or 0)
                }
                for result in top_models
            ]
        }
    except Exception as e:
        logger.error(f"Error getting brand metrics for {brand_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/brand/{brand_name}/detailed")
async def get_detailed_brand_analysis(brand_name: str, db: Session = Depends(get_db)):
    """Get comprehensive detailed analysis for a specific brand"""
    try:
        # Get the most recent inventory date
        most_recent_date = db.query(func.max(FactDailyInventory.date_key)).scalar()
        
        # Calculate date ranges
        today = date.today()
        thirty_days_ago = today - timedelta(days=30)
        thirty_days_ago_key = int(thirty_days_ago.strftime("%Y%m%d"))
        ninety_days_ago = today - timedelta(days=90)
        ninety_days_ago_key = int(ninety_days_ago.strftime("%Y%m%d"))
        
        # Basic metrics
        total_vehicles = db.query(func.count(func.distinct(FactDailyInventory.vin))).filter(
            FactDailyInventory.date_key == most_recent_date,
            DimVehicle.brand == brand_name
        ).join(
            DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        avg_price = db.query(func.avg(FactDailyInventory.price)).filter(
            FactDailyInventory.date_key == most_recent_date,
            DimVehicle.brand == brand_name,
            FactDailyInventory.price.isnot(None),
            FactDailyInventory.price > 0
        ).join(
            DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        # Sales breakdown by model (last 30 days)
        sales_by_model = db.query(
            DimVehicle.model,
            func.count(FactSalesEvents.vin).label('sales_count'),
            func.avg(FactSalesEvents.sale_price).label('avg_price'),
            func.sum(FactSalesEvents.sale_price).label('total_revenue'),
            func.avg(FactSalesEvents.days_to_sell).label('avg_days_to_sell')
        ).join(
            FactSalesEvents, DimVehicle.vehicle_key == FactSalesEvents.vehicle_key
        ).filter(
            FactSalesEvents.sale_date_key >= thirty_days_ago_key,
            FactSalesEvents.sale_date_key <= int(today.strftime("%Y%m%d")),
            DimVehicle.brand == brand_name
        ).group_by(
            DimVehicle.model
        ).order_by(
            desc(func.count(FactSalesEvents.vin))
        ).all()
        
        # Price distribution for current inventory
        price_distribution = db.query(
            DimPriceRange.range_name,
            func.count(FactDailyInventory.vin).label('inventory_count')
        ).join(
            FactDailyInventory, DimPriceRange.price_range_key == FactDailyInventory.price_range_key
        ).join(
            DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
        ).filter(
            FactDailyInventory.date_key == most_recent_date,
            DimVehicle.brand == brand_name
        ).group_by(
            DimPriceRange.range_name
        ).order_by(
            DimPriceRange.min_price
        ).all()
        
        # Sales trend over last 90 days (weekly)
        sales_trend = db.query(
            DimDate.full_date,
            func.count(FactSalesEvents.vin).label('sales_count'),
            func.avg(FactSalesEvents.sale_price).label('avg_price')
        ).join(
            FactSalesEvents, DimDate.date_key == FactSalesEvents.sale_date_key
        ).join(
            DimVehicle, FactSalesEvents.vehicle_key == DimVehicle.vehicle_key
        ).filter(
            FactSalesEvents.sale_date_key >= ninety_days_ago_key,
            FactSalesEvents.sale_date_key <= int(today.strftime("%Y%m%d")),
            DimVehicle.brand == brand_name
        ).group_by(
            DimDate.full_date
        ).order_by(
            DimDate.full_date
        ).limit(12).all()
        
        # Inventory age analysis
        inventory_age = db.query(
            case(
                (FactDailyInventory.days_on_lot <= 7, '0-7 days'),
                (FactDailyInventory.days_on_lot <= 14, '8-14 days'),
                (FactDailyInventory.days_on_lot <= 30, '15-30 days'),
                (FactDailyInventory.days_on_lot <= 60, '31-60 days'),
                (FactDailyInventory.days_on_lot <= 90, '61-90 days'),
                else_='90+ days'
            ).label('age_group'),
            func.count(FactDailyInventory.vin).label('inventory_count')
        ).join(
            DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
        ).filter(
            FactDailyInventory.date_key == most_recent_date,
            DimVehicle.brand == brand_name,
            FactDailyInventory.days_on_lot > 0
        ).group_by(
            case(
                (FactDailyInventory.days_on_lot <= 7, '0-7 days'),
                (FactDailyInventory.days_on_lot <= 14, '8-14 days'),
                (FactDailyInventory.days_on_lot <= 30, '15-30 days'),
                (FactDailyInventory.days_on_lot <= 60, '31-60 days'),
                (FactDailyInventory.days_on_lot <= 90, '61-90 days'),
                else_='90+ days'
            )
        ).order_by(
            case(
                (FactDailyInventory.days_on_lot <= 7, 1),
                (FactDailyInventory.days_on_lot <= 14, 2),
                (FactDailyInventory.days_on_lot <= 30, 3),
                (FactDailyInventory.days_on_lot <= 60, 4),
                (FactDailyInventory.days_on_lot <= 90, 5),
                else_=6
            )
        ).all()
        
        # Performance metrics
        total_sales_30_days = sum(model.sales_count for model in sales_by_model)
        total_revenue_30_days = sum(float(model.total_revenue or 0) for model in sales_by_model)
        avg_days_to_sell = db.query(func.avg(FactSalesEvents.days_to_sell)).filter(
            FactSalesEvents.sale_date_key >= thirty_days_ago_key,
            FactSalesEvents.sale_date_key <= int(today.strftime("%Y%m%d")),
            DimVehicle.brand == brand_name,
            FactSalesEvents.days_to_sell > 0,
            FactSalesEvents.days_to_sell <= 365
        ).join(
            DimVehicle, FactSalesEvents.vehicle_key == DimVehicle.vehicle_key
        ).scalar() or 0
        
        return {
            "brand_name": brand_name,
            "basic_metrics": {
                "total_vehicles": total_vehicles,
                "average_price": float(avg_price),
                "total_sales_30_days": total_sales_30_days,
                "total_revenue_30_days": float(total_revenue_30_days),
                "avg_days_to_sell": float(avg_days_to_sell)
            },
            "sales_by_model": [
                {
                    "model": result.model,
                    "sales_count": result.sales_count,
                    "avg_price": float(result.avg_price or 0),
                    "total_revenue": float(result.total_revenue or 0),
                    "avg_days_to_sell": float(result.avg_days_to_sell or 0)
                }
                for result in sales_by_model
            ],
            "price_distribution": [
                {
                    "price_range": result.range_name,
                    "inventory_count": result.inventory_count
                }
                for result in price_distribution
            ],
            "sales_trend": [
                {
                    "week_start": result.full_date.strftime("%Y-%m-%d") if result.full_date else None,
                    "sales_count": result.sales_count,
                    "avg_price": float(result.avg_price or 0)
                }
                for result in sales_trend
            ],
            "inventory_age": [
                {
                    "age_group": result.age_group,
                    "inventory_count": result.inventory_count
                }
                for result in inventory_age
            ]
        }
    except Exception as e:
        logger.error(f"Error getting detailed brand analysis for {brand_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def get_kpis(db: Session, today_key: int) -> KPIResponse:
    """Get Key Performance Indicators"""
    logger.info(f"Getting KPIs for date_key: {today_key}")
    
    # Calculate 30 days ago properly (with 2-day lag)
    today = date.today() - timedelta(days=2)  # 2-day lag
    thirty_days_ago = today - timedelta(days=30)
    thirty_days_ago_key = int(thirty_days_ago.strftime("%Y%m%d"))
    
    # Check inventory - count distinct VINs where status = 'active' (no date filter)
    inventory_today = db.query(func.count(func.distinct(FactDailyInventory.vin))).filter(
        FactDailyInventory.status == 'active'
    ).scalar() or 0
    
    # Check sales for last 30 days with data quality filters
    sales_last_30_days = db.query(func.count(FactSalesEvents.vin)).filter(
        FactSalesEvents.sale_date_key >= thirty_days_ago_key,
        FactSalesEvents.sale_date_key <= today_key,
        FactSalesEvents.vin.isnot(None),  # Ensure VIN is not null
        FactSalesEvents.sale_price.isnot(None)  # Ensure price is not null
    ).scalar() or 0
    
    # If no sales in last 30 days, check if we have any sales data at all
    if not sales_last_30_days:
        total_sales_check = db.query(func.count(FactSalesEvents.vin)).filter(
            FactSalesEvents.vin.isnot(None),
            FactSalesEvents.sale_price.isnot(None)
        ).scalar() or 0
        logger.info(f"No sales in last 30 days, total sales in database: {total_sales_check}")
    
    # Average days to sell (last 30 days) - only consider reasonable values
    avg_days_to_sell = db.query(func.avg(FactSalesEvents.days_to_sell)).filter(
        FactSalesEvents.sale_date_key >= thirty_days_ago_key,
        FactSalesEvents.sale_date_key <= today_key,
        FactSalesEvents.days_to_sell > 0,
        FactSalesEvents.days_to_sell <= 365  # Cap at 1 year to avoid outliers
    ).scalar() or 0.0
    
    # Average sale price (last 30 days) - only consider reasonable values
    avg_sale_price = db.query(func.avg(FactSalesEvents.sale_price)).filter(
        FactSalesEvents.sale_date_key >= thirty_days_ago_key,
        FactSalesEvents.sale_date_key <= today_key,
        FactSalesEvents.sale_price.isnot(None),
        FactSalesEvents.sale_price > 0,  # Only positive prices
        FactSalesEvents.sale_price <= 200000  # Cap at $200k to avoid outliers
    ).scalar() or 0.0
    
    logger.info(f"KPIs: inventory={inventory_today}, sales={sales_last_30_days}, avg_days={avg_days_to_sell}, avg_price={avg_sale_price}")
    
    return KPIResponse(
        total_active_inventory=int(inventory_today),
        total_sales_today=int(sales_last_30_days),
        average_days_to_sell=float(avg_days_to_sell),
        average_sale_price=float(avg_sale_price)
    )

async def get_daily_sales_trend(db: Session, start_date_key: int, end_date_key: int) -> List[DailySalesTrendItem]:
    """Get daily sales trend for the last 30 days"""
    logger.info(f"Getting daily sales trend from {start_date_key} to {end_date_key}")
    
    # First, ensure we have all dates in the range
    all_dates = db.query(DimDate).filter(
        DimDate.date_key >= start_date_key,
        DimDate.date_key <= end_date_key
    ).order_by(DimDate.date_key).all()
    
    logger.info(f"Found {len(all_dates)} dates in range")
    
    # Create a dictionary to store sales data by date
    sales_by_date = {}
    
    # Get sales data for the date range
    sales_results = db.query(
        DimDate.date_key,
        DimDate.full_date,
        func.count(FactSalesEvents.vin).label('sales_count'),
        func.coalesce(func.sum(FactSalesEvents.sale_price), 0).label('total_sales_amount')
    ).outerjoin(
        FactSalesEvents, DimDate.date_key == FactSalesEvents.sale_date_key
    ).filter(
        DimDate.date_key >= start_date_key,
        DimDate.date_key <= end_date_key
    ).group_by(
        DimDate.date_key, DimDate.full_date
    ).all()
    
    logger.info(f"Found {len(sales_results)} sales records")
    
    # Create a lookup dictionary for sales data
    for result in sales_results:
        sales_by_date[result.date_key] = {
            'sales_count': result.sales_count,
            'total_sales_amount': result.total_sales_amount
        }
    
    # Build the complete timeline with all dates
    timeline_items = []
    for date_record in all_dates:
        sales_data = sales_by_date.get(date_record.date_key, {'sales_count': 0, 'total_sales_amount': 0})
        
        timeline_items.append(
            DailySalesTrendItem(
                date=date_record.full_date,
                sales_count=sales_data['sales_count'],
                total_sales_amount=float(sales_data['total_sales_amount'] or 0)
            )
        )
    
    logger.info(f"Returning {len(timeline_items)} timeline items")
    return timeline_items

async def get_inventory_by_price_range(db: Session, date_key: int) -> List[InventoryByPriceRangeItem]:
    """Get inventory distribution by price range"""
    logger.info(f"Querying inventory for date_key: {date_key}")
    
    # First check if we have any data for this date
    total_inventory_check = db.query(func.count(FactDailyInventory.vin)).filter(
        FactDailyInventory.date_key == date_key
    ).scalar()
    logger.info(f"Total inventory for date {date_key}: {total_inventory_check}")
    
    # If no data for today, try the most recent date
    if not total_inventory_check:
        most_recent_date = db.query(func.max(FactDailyInventory.date_key)).scalar()
        logger.info(f"No data for {date_key}, using most recent date: {most_recent_date}")
        if most_recent_date:
            date_key = most_recent_date
    
    results = db.query(
        DimPriceRange.range_name,
        func.count(FactDailyInventory.vin).label('inventory_count')
    ).join(
        FactDailyInventory, DimPriceRange.price_range_key == FactDailyInventory.price_range_key
    ).filter(
        FactDailyInventory.date_key == date_key
    ).group_by(
        DimPriceRange.range_name
    ).all()
    
    logger.info(f"Found {len(results)} price range results")
    
    total_inventory = sum(result.inventory_count for result in results)
    
    return [
        InventoryByPriceRangeItem(
            price_range=result.range_name,
            inventory_count=result.inventory_count,
            percentage=round((result.inventory_count / total_inventory * 100), 2) if total_inventory > 0 else 0
        )
        for result in results
    ]

async def get_sales_by_brand(db: Session, start_date_key: int, end_date_key: int) -> List[SalesByBrandItem]:
    """Get sales distribution by brand"""
    logger.info(f"Querying sales by brand from {start_date_key} to {end_date_key}")
    
    results = db.query(
        DimVehicle.brand,
        func.count(FactSalesEvents.vin).label('sales_count'),
        func.avg(FactSalesEvents.sale_price).label('avg_sale_price')
    ).join(
        FactSalesEvents, DimVehicle.vehicle_key == FactSalesEvents.vehicle_key
    ).filter(
        FactSalesEvents.sale_date_key >= start_date_key,
        FactSalesEvents.sale_date_key <= end_date_key
    ).group_by(
        DimVehicle.brand
    ).order_by(
        desc(func.count(FactSalesEvents.vin))
    ).limit(10).all()
    
    logger.info(f"Found {len(results)} brand results")
    
    # If no results in date range, get any sales data available
    if not results:
        logger.info("No sales in date range, checking all sales")
        results = db.query(
            DimVehicle.brand,
            func.count(FactSalesEvents.vin).label('sales_count'),
            func.avg(FactSalesEvents.sale_price).label('avg_sale_price')
        ).join(
            FactSalesEvents, DimVehicle.vehicle_key == FactSalesEvents.vehicle_key
        ).group_by(
            DimVehicle.brand
        ).order_by(
            desc(func.count(FactSalesEvents.vin))
        ).limit(10).all()
        logger.info(f"Found {len(results)} total brand results")
    
    total_sales = sum(result.sales_count for result in results)
    
    return [
        SalesByBrandItem(
            brand=result.brand or "Unknown",
            sales_count=result.sales_count,
            percentage=round((result.sales_count / total_sales * 100), 2) if total_sales > 0 else 0,
            avg_sale_price=float(result.avg_sale_price or 0)
        )
        for result in results
    ]

async def get_days_on_lot_by_price_range(db: Session, date_key: int) -> List[DaysOnLotByPriceRangeItem]:
    """Get average days on lot by price range"""
    logger.info(f"Querying days on lot for date_key: {date_key}")
    
    # If no data for today, try the most recent date
    data_check = db.query(func.count(FactDailyInventory.vin)).filter(
        FactDailyInventory.date_key == date_key
    ).scalar()
    
    if not data_check:
        most_recent_date = db.query(func.max(FactDailyInventory.date_key)).scalar()
        logger.info(f"No data for {date_key}, using most recent date: {most_recent_date}")
        if most_recent_date:
            date_key = most_recent_date
    
    results = db.query(
        DimPriceRange.range_name,
        func.avg(FactDailyInventory.days_on_lot).label('avg_days_on_lot')
    ).join(
        FactDailyInventory, DimPriceRange.price_range_key == FactDailyInventory.price_range_key
    ).filter(
        FactDailyInventory.date_key == date_key,
        FactDailyInventory.days_on_lot > 0
    ).group_by(
        DimPriceRange.range_name
    ).all()
    
    logger.info(f"Found {len(results)} days on lot results")
    
    return [
        DaysOnLotByPriceRangeItem(
            price_range=result.range_name,
            avg_days_on_lot=float(result.avg_days_on_lot or 0)
        )
        for result in results
    ]

async def get_top_selling_models(db: Session, start_date_key: int, end_date_key: int) -> List[TopSellingModelItem]:
    """Get top selling models"""
    results = db.query(
        DimVehicle.manufacturer,
        DimVehicle.model,
        DimVehicle.brand,
        func.count(FactSalesEvents.vin).label('units_sold'),
        func.avg(FactSalesEvents.sale_price).label('avg_sale_price'),
        func.avg(FactSalesEvents.days_to_sell).label('avg_days_to_sell')
    ).join(
        FactSalesEvents, DimVehicle.vehicle_key == FactSalesEvents.vehicle_key
    ).filter(
        FactSalesEvents.sale_date_key >= start_date_key,
        FactSalesEvents.sale_date_key <= end_date_key
    ).group_by(
        DimVehicle.manufacturer,
        DimVehicle.model,
        DimVehicle.brand
    ).order_by(
        desc(func.count(FactSalesEvents.vin))
    ).limit(10).all()
    
    return [
        TopSellingModelItem(
            manufacturer=result.manufacturer,
            model=result.model,
            brand=result.brand or "Unknown",
            units_sold=result.units_sold,
            avg_sale_price=float(result.avg_sale_price or 0),
            avg_days_to_sell=float(result.avg_days_to_sell or 0)
        )
        for result in results
    ]

async def get_slow_moving_inventory(db: Session, date_key: int) -> List[SlowMovingInventoryItem]:
    """Get slow moving inventory (vehicles on lot > 30 days)"""
    logger.info(f"Querying slow moving inventory for date_key: {date_key}")
    
    # If no data for today, try the most recent date
    data_check = db.query(func.count(FactDailyInventory.vin)).filter(
        FactDailyInventory.date_key == date_key,
        FactDailyInventory.days_on_lot > 30
    ).scalar()
    
    if not data_check:
        most_recent_date = db.query(func.max(FactDailyInventory.date_key)).scalar()
        logger.info(f"No data for {date_key}, using most recent date: {most_recent_date}")
        if most_recent_date:
            date_key = most_recent_date
    
    results = db.query(
        FactDailyInventory.vin,
        FactDailyInventory.days_on_lot,
        DimVehicle.manufacturer,
        DimVehicle.model,
        DimVehicle.brand,
        FactDailyInventory.price
    ).join(
        DimVehicle, FactDailyInventory.vehicle_key == DimVehicle.vehicle_key
    ).filter(
        FactDailyInventory.date_key == date_key,
        FactDailyInventory.days_on_lot > 30
    ).distinct().order_by(
        desc(FactDailyInventory.days_on_lot)
    ).limit(20).all()
    
    logger.info(f"Found {len(results)} slow moving inventory items")
    
    return [
        SlowMovingInventoryItem(
            vin=result.vin,
            manufacturer=result.manufacturer,
            model=result.model,
            brand=result.brand or "Unknown",
            days_on_lot=result.days_on_lot or 0,
            price=float(result.price or 0)
        )
        for result in results
    ]

async def get_recent_sales(db: Session, end_date_key: int) -> List[RecentSaleItem]:
    """Get recent sales (last 10 unique sales)"""
    logger.info(f"Querying recent sales up to date_key: {end_date_key}")
    
    results = db.query(
        DimDate.full_date,
        FactSalesEvents.vin,
        FactSalesEvents.sale_date_key,
        DimVehicle.manufacturer,
        DimVehicle.model,
        DimVehicle.brand,
        FactSalesEvents.sale_price,
        FactSalesEvents.days_to_sell
    ).join(
        DimDate, FactSalesEvents.sale_date_key == DimDate.date_key
    ).join(
        DimVehicle, FactSalesEvents.vehicle_key == DimVehicle.vehicle_key
    ).filter(
        FactSalesEvents.sale_date_key <= end_date_key
    ).distinct().order_by(
        desc(FactSalesEvents.sale_date_key)
    ).limit(10).all()
    
    # If no recent sales, get any sales available
    if not results:
        logger.info("No recent sales found, getting any available sales")
        results = db.query(
            DimDate.full_date,
            FactSalesEvents.vin,
            FactSalesEvents.sale_date_key,
            DimVehicle.manufacturer,
            DimVehicle.model,
            DimVehicle.brand,
            FactSalesEvents.sale_price,
            FactSalesEvents.days_to_sell
        ).join(
            DimDate, FactSalesEvents.sale_date_key == DimDate.date_key
        ).join(
            DimVehicle, FactSalesEvents.vehicle_key == DimVehicle.vehicle_key
        ).distinct().order_by(
            desc(FactSalesEvents.sale_date_key)
        ).limit(10).all()
    
    logger.info(f"Found {len(results)} recent sales")
    
    return [
        RecentSaleItem(
            sale_date=result.full_date,
            vin=result.vin,
            manufacturer=result.manufacturer,
            model=result.model,
            brand=result.brand or "Unknown",
            sale_price=float(result.sale_price or 0),
            days_to_sell=result.days_to_sell or 0
        )
        for result in results
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9515)
