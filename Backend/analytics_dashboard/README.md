# Carvana Analytics Dashboard API

A FastAPI-based4. **Update database connection**
   Edit the `.env` file with your PostgreSQL connection details:
   ```
   # The system will automatically build the DATABASE_URL based on ENVIRONMENT
   # For dev: connects to brahma:5432
   # For prod: connects to postgres_db:5432
   ENVIRONMENT=dev
   
   # Or override with custom DATABASE_URL:
   # DATABASE_URL=postgresql://admin:raghu@123@your_host:5432/carvana_db
   ```ytics dashboard for Carvana vehicle inventory and sales data.

## Features

- **KPIs**: Total active inventory, daily sales, average days to sell, average sale price
- **Charts**: Daily sales trends, inventory by price range, sales by brand, days on lot analysis
- **Tables**: Top selling models, slow-moving inventory, recent sales

## Database Schema

The API works with the following tables:
- `dim_date` - Date dimension
- `dim_vehicle` - Vehicle dimension (manufacturer, model, brand, color)
- `dim_price_range` - Price range dimension
- `fact_daily_inventory` - Daily inventory snapshot
- `fact_sales_events` - Sales transaction events

## Setup

### Prerequisites
- Python 3.8+
- PostgreSQL database with your fact and dimension tables

### Installation

1. **Clone and navigate to the project directory**
   ```bash
   cd Carvana/Backend/analytics_dashboard
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Unix/MacOS
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection details
   ```

5. **Update database connection**
   Edit the `.env` file with your PostgreSQL connection details:
   ```
   DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
   ```

### Running the Application

#### Option 1: Docker Deployment (Recommended)

1. **Quick deployment using the script**
   ```bash
   # On Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   
   # On Windows (PowerShell)
   .\deploy.ps1
   ```

2. **Manual Docker deployment**
   ```bash
   # Build and start
   docker-compose up -d --build
   
   # View logs
   docker-compose logs -f carvana-analytics-api
   
   # Stop
   docker-compose down
   ```

3. **Development mode with hot reload**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
   ```

#### Option 2: Local Development

1. **Start the API server**
   ```bash
   python run.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 9515 --reload
   ```

#### Access Points
   #### Access Points
- API: http://localhost:9515
- Interactive docs: http://localhost:9515/docs
- ReDoc docs: http://localhost:9515/redoc

## Docker Configuration

The application is containerized and connects to the same `data-infra-network` as your PostgreSQL database. The Docker setup includes:

- **Production container**: Optimized Python 3.11 slim image
- **Health checks**: Automatic API health monitoring
- **Network integration**: Connects to existing `data-infra-network`
- **Security**: Runs as non-root user
- **Development mode**: Hot reload support

## API Endpoints

### Dashboard Data
- `GET /dashboard` - Get complete dashboard data including KPIs, charts, and tables
- `GET /health` - Health check endpoint

### Response Structure

```json
{
  "kpis": {
    "total_active_inventory": 1500,
    "total_sales_today": 25,
    "average_days_to_sell": 45.2,
    "average_sale_price": 28500.00
  },
  "daily_sales_trend": [...],
  "inventory_by_price_range": [...],
  "sales_by_brand": [...],
  "days_on_lot_by_price_range": [...],
  "top_selling_models": [...],
  "slow_moving_inventory": [...],
  "recent_sales": [...]
}
```

## Development

### Project Structure
```
analytics_dashboard/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── config.py            # Settings configuration
│   ├── models/
│   │   └── __init__.py      # SQLAlchemy models
│   └── schemas/
│       └── __init__.py      # Pydantic schemas
├── requirements.txt
├── run.py
├── .env.example
└── README.md
```

### Adding New Endpoints

1. Add new Pydantic schemas in `app/schemas/__init__.py`
2. Add new endpoint functions in `app/main.py`
3. Test the endpoint using the interactive docs at `/docs`

## Deployment

For production deployment:

1. Set environment variables appropriately
2. Use a production WSGI server like Gunicorn
3. Configure reverse proxy (nginx)
4. Set up SSL/TLS certificates
5. Configure monitoring and logging

Example production command:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
