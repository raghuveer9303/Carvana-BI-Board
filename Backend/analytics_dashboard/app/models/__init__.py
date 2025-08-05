from sqlalchemy import create_engine, Column, Integer, String, Date, Numeric, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import INTEGER, VARCHAR, NUMERIC, DATE

Base = declarative_base()

class DimDate(Base):
    __tablename__ = "dim_date"
    
    date_key = Column(INTEGER, primary_key=True)
    full_date = Column(DATE, nullable=False)
    day_of_week = Column(INTEGER)
    day_name = Column(VARCHAR(10))
    day_of_month = Column(INTEGER)
    day_of_year = Column(INTEGER)
    week_of_year = Column(INTEGER)
    month = Column(INTEGER)
    month_name = Column(VARCHAR(10))
    quarter = Column(INTEGER)
    year = Column(INTEGER)
    is_weekend = Column(INTEGER)
    is_holiday = Column(INTEGER)

class DimVehicle(Base):
    __tablename__ = "dim_vehicle"
    
    vehicle_key = Column(INTEGER, primary_key=True, autoincrement=True)
    manufacturer = Column(VARCHAR(50), nullable=False)
    model = Column(VARCHAR(100), nullable=False)
    brand = Column(VARCHAR(50))
    color = Column(VARCHAR(30))
    created_at = Column(DATE)
    
    # Relationships
    daily_inventory = relationship("FactDailyInventory", back_populates="vehicle")
    sales_events = relationship("FactSalesEvents", back_populates="vehicle")

class DimPriceRange(Base):
    __tablename__ = "dim_price_range"
    
    price_range_key = Column(INTEGER, primary_key=True, autoincrement=True)
    range_name = Column(VARCHAR(50), nullable=False)
    min_price = Column(NUMERIC(10, 2), nullable=False)
    max_price = Column(NUMERIC(10, 2), nullable=False)
    description = Column(Text)
    
    # Relationships
    daily_inventory = relationship("FactDailyInventory", back_populates="price_range")

class FactDailyInventory(Base):
    __tablename__ = "fact_daily_inventory"
    
    # Composite primary key based on the actual schema
    date_key = Column(INTEGER, ForeignKey("dim_date.date_key"), primary_key=True)
    vin = Column(VARCHAR(17), primary_key=True)
    vehicle_key = Column(INTEGER, ForeignKey("dim_vehicle.vehicle_key"))
    price_range_key = Column(INTEGER, ForeignKey("dim_price_range.price_range_key"))
    price = Column(NUMERIC(10, 2))
    mileage = Column(INTEGER)
    status = Column(VARCHAR(20))
    active_count = Column(INTEGER, default=0)
    new_arrivals = Column(INTEGER, default=0)
    sold_count = Column(INTEGER, default=0)
    days_on_lot = Column(INTEGER, default=0)
    
    # Relationships
    date = relationship("DimDate")
    vehicle = relationship("DimVehicle", back_populates="daily_inventory")
    price_range = relationship("DimPriceRange", back_populates="daily_inventory")

class FactSalesEvents(Base):
    __tablename__ = "fact_sales_events"
    
    # Composite primary key based on the actual schema
    sale_date_key = Column(INTEGER, ForeignKey("dim_date.date_key"), primary_key=True)
    vin = Column(VARCHAR(17), primary_key=True)
    vehicle_key = Column(INTEGER, ForeignKey("dim_vehicle.vehicle_key"))
    sale_price = Column(NUMERIC(10, 2))
    sale_mileage = Column(INTEGER)
    days_to_sell = Column(INTEGER, default=0)
    added_date = Column(DATE)
    sold_date = Column(DATE)
    
    # Relationships
    sale_date = relationship("DimDate")
    vehicle = relationship("DimVehicle", back_populates="sales_events")
