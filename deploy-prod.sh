#!/bin/bash

# Carvana Analytics - Production Deployment Script
set -e

echo "🚀 Starting Carvana Analytics Production Deployment..."

# Check if docker and docker-compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if data-infra-network exists
if ! docker network ls | grep -q "data-infra-network"; then
    echo "❌ data-infra-network not found. Please ensure PostgreSQL is running in data-infra-network."
    exit 1
fi

# Check if postgres_db is running
if ! docker ps | grep -q "postgres_db"; then
    echo "❌ postgres_db container not found. Please ensure PostgreSQL is running."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the configuration."
fi

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

# Pull latest images and build
echo "🔧 Building and pulling images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "unhealthy\|Exit"; then
    echo "❌ Some services are not healthy. Check logs:"
    docker-compose -f docker-compose.prod.yml logs --tail=50
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Access the application at: http://localhost:9517"
echo "📊 API Health Check: http://localhost:9517/health"
echo "📋 View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Stop services: docker-compose -f docker-compose.prod.yml down"
