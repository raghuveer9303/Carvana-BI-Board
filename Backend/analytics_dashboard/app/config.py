import os
from pydantic_settings import BaseSettings
from typing import List
from urllib.parse import quote_plus

def _get_database_url() -> str:
    """Build database URL from environment variables or defaults"""
    ENVIRONMENT = os.getenv("ENVIRONMENT", "dev")
    
    DB_USER = "admin"
    DB_PASSWORD = "raghu@123"  # Raw password (will be URL-encoded)
    DB_NAME = "carvana_db"
    DB_PORT = "5432"
    
    if ENVIRONMENT == "prod":
        DB_HOST = "postgres_db"
    else:  # dev environment
        DB_HOST = "brahma"
    
    # URL encode the password when building the connection string
    encoded_password = quote_plus(DB_PASSWORD)
    return f"postgresql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

class Settings(BaseSettings):
    # Database - Use environment variable or build from components
    database_url: str = os.getenv("DATABASE_URL") or _get_database_url()
    
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
