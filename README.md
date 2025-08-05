# 🚗 Carvana Analytics Dashboard

A production-ready analytics dashboard for Carvana vehicle inventory and sales data, featuring a modern React frontend, FastAPI backend, and comprehensive data visualization.

![Carvana Analytics](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

## 📊 Features

### Frontend Dashboard
- **Real-time Analytics**: Live inventory tracking and sales metrics
- **Interactive Charts**: Powered by modern charting libraries
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components and Radix UI
- **Performance Optimized**: Vite build system with code splitting

### Backend API
- **FastAPI Framework**: High-performance async API
- **PostgreSQL Integration**: Robust data persistence
- **Automatic Documentation**: Swagger/OpenAPI integration
- **Health Monitoring**: Built-in health checks
- **CORS Configuration**: Production-ready security settings

### Production Infrastructure
- **Docker Containerization**: Multi-stage production builds
- **Nginx Reverse Proxy**: Load balancing and caching
- **Database Integration**: External PostgreSQL support
- **Security Features**: Rate limiting, security headers
- **Monitoring**: Health checks and logging

## 🏗️ Architecture

```
Internet (Port 9517)
         ↓
    Nginx Proxy
    ┌─────────────┐
    │   Routes    │
    │ / → Frontend│
    │/api → Backend│
    └─────────────┘
         ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React)       │    │   (FastAPI)     │    │   (External)    │
│   Nginx + Vite  │    │   Multi-worker  │    │  data-infra-net │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose available
- External PostgreSQL running in `data-infra-network` as `postgres_db`

### One-Command Deployment

**Windows:**
```powershell
cd Carvana
.\deploy-prod.ps1
```

**Linux/macOS:**
```bash
cd Carvana
chmod +x deploy-prod.sh
./deploy-prod.sh
```

### Access Points
- **Main Application**: http://localhost:9517
- **API Documentation**: http://localhost:9517/api/docs
- **Health Check**: http://localhost:9517/health

## 🛠️ Development Setup

### Frontend Development
```bash
cd Frontend/flux-drive-analytics
npm install
npm run dev
```

### Backend Development
```bash
cd Backend/analytics_dashboard
pip install -r requirements.txt
python run.py
```

## 📁 Project Structure

```
Carvana/
├── Frontend/flux-drive-analytics/     # React TypeScript Frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── pages/                   # Page components
│   │   └── lib/                     # Utilities
│   ├── Dockerfile.prod              # Production Docker build
│   └── vite.config.ts              # Vite configuration
│
├── Backend/analytics_dashboard/      # FastAPI Backend
│   ├── app/
│   │   ├── models/                  # Database models
│   │   ├── schemas/                 # Pydantic schemas
│   │   ├── main.py                  # FastAPI application
│   │   └── config.py               # Configuration
│   ├── Dockerfile.prod             # Production Docker build
│   └── requirements.txt            # Python dependencies
│
├── nginx/                          # Nginx Configuration
│   ├── nginx.conf                  # Main nginx config
│   └── conf.d/default.conf        # Reverse proxy rules
│
├── docker-compose.prod.yml         # Production deployment
├── deploy-prod.sh                  # Linux deployment script
├── deploy-prod.ps1                 # Windows deployment script
└── README.md                       # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```env
# Database Configuration
DB_PASSWORD=your_secure_password

# Backend API Configuration  
API_TITLE=Carvana Analytics Dashboard API
API_VERSION=1.0.0
LOG_LEVEL=INFO

# CORS Origins
ALLOWED_ORIGINS=["http://localhost:9517"]
```

### Network Requirements
The application expects:
- External PostgreSQL in `data-infra-network`
- Database container named `postgres_db`
- Database name: `carvana_db`
- Database user: `admin`

## 🐳 Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| Frontend | `carvana_frontend` | 80 | React app with Nginx |
| Backend | `carvana_backend` | 9515 | FastAPI with Uvicorn |
| Proxy | `carvana_nginx` | 9517 | Nginx reverse proxy |
| Database | `postgres_db` | 5432 | External PostgreSQL |

## 📊 API Endpoints

### Core Endpoints
- `GET /` - API root
- `GET /health` - Health check
- `GET /api/docs` - Swagger documentation

### Analytics Endpoints
- `GET /api/dashboard` - Main dashboard data
- `GET /api/kpis` - Key performance indicators
- `GET /api/sales-trends` - Sales trend analysis
- `GET /api/inventory` - Inventory analytics

## 🔒 Security Features

- **Rate Limiting**: API and general request limits
- **CORS Protection**: Configured allowed origins
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **Container Security**: Non-root users, minimal images
- **Network Isolation**: Docker network segmentation

## 📈 Performance Optimizations

### Frontend
- Code splitting and lazy loading
- Gzipped assets with caching headers
- Optimized bundle sizes
- Service worker ready

### Backend
- Multi-worker Uvicorn deployment
- Connection pooling
- Async request handling
- Efficient database queries

### Infrastructure
- Nginx proxy caching
- Static asset optimization
- Health check monitoring
- Resource limits

## 🧪 Testing

### Backend Tests
```bash
cd Backend/analytics_dashboard
pytest
```

### Frontend Tests
```bash
cd Frontend/flux-drive-analytics
npm test
```

## 📝 Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f carvana-backend
```

### Service Management
```bash
# Check status
docker-compose -f docker-compose.prod.yml ps

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Update deployment
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 🔍 Monitoring & Health Checks

All services include comprehensive health checks:
- **Frontend**: Nginx response check
- **Backend**: HTTP health endpoint
- **Database**: PostgreSQL connection test
- **Proxy**: HTTP availability test

Health endpoints return JSON status:
```json
{
  "status": "healthy",
  "timestamp": "2025-08-05T10:30:00Z"
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Port 9517 already in use**
   ```bash
   # Windows
   netstat -ano | findstr :9517
   
   # Linux/macOS
   lsof -i :9517
   ```

2. **Database connection failed**
   ```bash
   # Check if postgres_db is running
   docker ps | grep postgres_db
   
   # Check network connectivity
   docker network ls | grep data-infra-network
   ```

3. **Build failures**
   ```bash
   # Clean rebuild
   docker-compose -f docker-compose.prod.yml down --volumes
   docker system prune -a
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

### Logs and Debugging
```bash
# Backend API logs
docker-compose -f docker-compose.prod.yml logs carvana-backend

# Frontend logs
docker-compose -f docker-compose.prod.yml logs carvana-frontend

# Nginx proxy logs
docker-compose -f docker-compose.prod.yml logs nginx
```

## 🔄 CI/CD Integration

The project is ready for CI/CD integration with:
- Docker multi-stage builds
- Health check endpoints
- Environment-based configuration
- Automated testing support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FastAPI**: Modern Python web framework
- **React**: Frontend library
- **PostgreSQL**: Robust database system
- **Docker**: Containerization platform
- **Nginx**: High-performance web server

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section
- Review the API documentation at `/api/docs`

---

**Built with ❤️ for modern vehicle analytics**
