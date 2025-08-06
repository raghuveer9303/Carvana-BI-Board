import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://admin:raghu@123@postgres_db:5432/carvana_db"
    
    # API
    api_title: str = "Carvana Analytics Dashboard API"
    api_version: str = "1.0.0"
    api_description: str = "Analytics API for Carvana vehicle inventory and sales data"
    
    # CORS - Updated for production with nginx proxy
    allowed_origins: List[str] = [
        "http://localhost:9517",
        "https://localhost:9517",
        "http://127.0.0.1:9517",
        "https://127.0.0.1:9517",
        "http://brahma:9517",
        "https://brahma:9517",
        "*"  # Allow all origins when behind nginx proxy
    ]
    
    # Logging
    log_level: str = "INFO"
    
    # Production settings
    debug: bool = False
    
    class Config:
        env_file = ".env"

settings = Settings()
