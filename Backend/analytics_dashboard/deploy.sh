#!/bin/bash

# Carvana Analytics Dashboard Deployment Script

set -e

echo "🚀 Deploying Carvana Analytics Dashboard..."

# Build and start the services
echo "📦 Building Docker image..."
docker-compose build

echo "🔗 Starting services on data-infra-network..."
docker-compose up -d

# Wait for the service to be healthy
echo "⏳ Waiting for API to be ready..."
timeout=60
counter=0

while [ $counter -lt $timeout ]; do
    if docker-compose ps | grep -q "healthy"; then
        echo "✅ Analytics API is healthy!"
        break
    fi
    
    if [ $counter -eq $timeout ]; then
        echo "❌ Timeout waiting for API to be ready"
        docker-compose logs
        exit 1
    fi
    
    echo "⏳ Waiting... ($((counter + 1))/$timeout)"
    sleep 1
    counter=$((counter + 1))
done

echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Analytics Dashboard is now available at:"
echo "   • API: http://localhost:9515"
echo "   • Interactive Docs: http://localhost:9515/docs"
echo "   • ReDoc: http://localhost:9515/redoc"
echo ""
echo "🔍 To view logs:"
echo "   docker-compose logs -f carvana-analytics-api"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
