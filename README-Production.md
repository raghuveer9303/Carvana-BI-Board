# Carvana Analytics - Production Deployment

This repository contains the production deployment configuration for the Carvana Analytics Dashboard, featuring a React frontend, FastAPI backend, PostgreSQL database, and Nginx reverse proxy.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React)       │    │   (FastAPI)     │    │   (External)    │
│   Port: 80      │    │   Port: 9515    │    │   postgres_db   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                  ┌─────────────────┐
                  │                 │
                  │  Nginx Proxy    │
                  │  Port: 9517     │
                  │                 │
                  └─────────────────┘
```

## Features

- **Frontend**: React application with Vite build system
- **Backend**: FastAPI with SQLAlchemy and PostgreSQL
- **Database**: External PostgreSQL in data-infra-network
- **Reverse Proxy**: Nginx with load balancing and caching
- **Production Ready**: Multi-stage Docker builds, health checks, logging
- **Security**: Rate limiting, CORS configuration, security headers

## Quick Start

### Prerequisites

- Docker Desktop
- Docker Compose
- **External PostgreSQL**: Ensure PostgreSQL is running in `data-infra-network` as `postgres_db`

### Deployment

1. **Clone and navigate to the project directory**:
   ```bash
   cd Carvana
   ```

2. **Run the deployment script**:

   **Linux/macOS**:
   ```bash
   chmod +x deploy-prod.sh
   ./deploy-prod.sh
   ```

   **Windows**:
   ```powershell
   .\deploy-prod.ps1
   ```

3. **Access the application**:
   - Main Application: http://localhost:9517
   - API Health Check: http://localhost:9517/health
   - API Documentation: http://localhost:9517/api/docs

## Manual Deployment

If you prefer to deploy manually:

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# vim .env

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database Configuration
DB_PASSWORD=your_secure_password

# Backend API Configuration
API_TITLE=Carvana Analytics Dashboard API
API_VERSION=1.0.0
LOG_LEVEL=INFO

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:9517/api
```

### Service Ports

- **Application**: `9517` (External access)
- **Backend API**: `9515` (Internal)
- **Frontend**: `80` (Internal)
- **Database**: `5432` (Internal)

## Services

### Frontend (carvana-frontend)
- Built with Vite and served by Nginx
- Optimized production build with code splitting
- Gzipped assets and caching headers

### Backend API (carvana-backend)
- FastAPI application with Uvicorn ASGI server
- Multiple workers for production performance
- Automatic API documentation at `/docs`
- Connects to external PostgreSQL in data-infra-network

### External Database (postgres_db)
- PostgreSQL running in data-infra-network
- Managed separately from this deployment
- Accessed via container name `postgres_db`

### Reverse Proxy (nginx)
- Routes `/api/*` to backend
- Routes everything else to frontend
- Rate limiting and security headers
- Gzip compression and caching

## Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f carvana-backend
```

### Check Service Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Stop Services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Update and Redeploy
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring and Health Checks

### Health Endpoints
- Frontend: `http://localhost:9517/health` (via nginx)
- Backend: `http://localhost:9517/api/health`

### Service Health Checks
All services include Docker health checks:
- Database: PostgreSQL connection test
- Backend: HTTP health endpoint
- Frontend: Nginx status check
- Nginx: HTTP response test

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Find process using port 9517
   lsof -i :9517  # macOS/Linux
   netstat -ano | findstr :9517  # Windows
   ```

2. **Database connection issues**:
   ```bash
   # Check if postgres_db is running in data-infra-network
   docker ps | grep postgres_db
   docker network ls | grep data-infra-network
   
   # Check backend logs for database connection
   docker-compose -f docker-compose.prod.yml logs carvana-backend
   ```

3. **Build failures**:
   ```bash
   # Clean build
   docker-compose -f docker-compose.prod.yml down --volumes
   docker system prune -a
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

### Logs Location

Container logs are available via Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml logs [service-name]
```

Nginx logs are also persisted in the `nginx_logs` volume.

## Security Considerations

- Database uses secure passwords (configure in `.env`)
- Nginx implements rate limiting
- CORS is configured for the application domain
- Security headers are applied
- Non-root users in containers
- Multi-stage builds to minimize attack surface

## Performance Optimization

- Frontend assets are gzipped and cached
- Backend runs with multiple workers
- Database connection pooling
- Nginx proxy caching for static assets
- Production-optimized Docker images

## Backup and Recovery

### Database Backup
Since the database is external, use the existing postgres_db container:
```bash
# Create backup
docker exec postgres_db pg_dump -U admin carvana_db > backup.sql

# Restore backup
docker exec -i postgres_db psql -U admin carvana_db < backup.sql
```

### Application Data
Application containers are stateless and can be rebuilt from source.
