#!/usr/bin/env python3
"""
Startup script for Carvana Analytics Dashboard API
"""
import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=9515,
        reload=True,
        log_level="info"
    )
