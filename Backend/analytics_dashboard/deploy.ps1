# Carvana Analytics Dashboard Deployment Script (PowerShell)

Write-Host "🚀 Deploying Carvana Analytics Dashboard..." -ForegroundColor Green

try {
    # Build and start the services
    Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
    docker-compose build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }

    Write-Host "🔗 Starting services on data-infra-network..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker compose up failed"
    }

    # Wait for the service to be healthy
    Write-Host "⏳ Waiting for API to be ready..." -ForegroundColor Yellow
    $timeout = 60
    $counter = 0

    while ($counter -lt $timeout) {
        $status = docker-compose ps --format json | ConvertFrom-Json
        $healthy = $status | Where-Object { $_.Health -eq "healthy" }
        
        if ($healthy) {
            Write-Host "✅ Analytics API is healthy!" -ForegroundColor Green
            break
        }
        
        if ($counter -eq $timeout) {
            Write-Host "❌ Timeout waiting for API to be ready" -ForegroundColor Red
            docker-compose logs
            exit 1
        }
        
        Write-Host "⏳ Waiting... ($($counter + 1)/$timeout)" -ForegroundColor Yellow
        Start-Sleep -Seconds 1
        $counter++
    }

    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Analytics Dashboard is now available at:" -ForegroundColor Cyan
    Write-Host "   • API: http://localhost:9515" -ForegroundColor White
    Write-Host "   • Interactive Docs: http://localhost:9515/docs" -ForegroundColor White
    Write-Host "   • ReDoc: http://localhost:9515/redoc" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 To view logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f carvana-analytics-api" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop:" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor White

} catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
