# Carvana Analytics - Production Deployment Script for Windows
# PowerShell script for Windows deployment

Write-Host "🚀 Starting Carvana Analytics Production Deployment..." -ForegroundColor Green

# Check if docker and docker-compose are installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Check if data-infra-network exists
$networkExists = docker network ls | Select-String "data-infra-network"
if (-not $networkExists) {
    Write-Host "❌ data-infra-network not found. Please ensure PostgreSQL is running in data-infra-network." -ForegroundColor Red
    exit 1
}

# Check if postgres_db is running
$postgresRunning = docker ps | Select-String "postgres_db"
if (-not $postgresRunning) {
    Write-Host "❌ postgres_db container not found. Please ensure PostgreSQL is running." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please review and update the configuration." -ForegroundColor Green
}

# Stop and remove existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down --remove-orphans

# Pull latest images and build
Write-Host "🔧 Building and pulling images..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
Write-Host "🚀 Starting services..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
$unhealthyServices = docker-compose -f docker-compose.prod.yml ps | Select-String "unhealthy|Exit"
if ($unhealthyServices) {
    Write-Host "❌ Some services are not healthy. Check logs:" -ForegroundColor Red
    docker-compose -f docker-compose.prod.yml logs --tail=50
    exit 1
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access the application at: http://localhost:9517" -ForegroundColor Cyan
Write-Host "📊 API Health Check: http://localhost:9517/health" -ForegroundColor Cyan
Write-Host "📋 View logs: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Cyan
Write-Host "🛑 Stop services: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Cyan
