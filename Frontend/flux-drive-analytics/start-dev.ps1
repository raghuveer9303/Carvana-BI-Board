#!/usr/bin/env powershell

# Carvana Analytics Dashboard - Development Server
Write-Host "🚀 Starting Carvana Analytics Dashboard (Apple + Google Design)" -ForegroundColor Green
Write-Host "   Aesthetic: Premium glass morphism with Material Design principles" -ForegroundColor Cyan
Write-Host "   Typography: SF Pro Display + Inter fonts" -ForegroundColor Cyan
Write-Host "   Colors: Apple-inspired with Google Material refinements" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "🎨 Launching development server..." -ForegroundColor Blue
Write-Host "   Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host "   Make sure backend is running on: http://localhost:9515" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev
