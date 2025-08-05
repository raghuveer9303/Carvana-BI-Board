from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
import logging
from urllib.parse import quote_plus

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "dev")

# Database credentials
DB_USER = "admin"
DB_PASSWORD = quote_plus("raghu@123")  # URL encode the password
DB_NAME = "carvana_db"
DB_PORT = "5432"

# Database configuration based on environment
if ENVIRONMENT == "prod":
    DB_HOST = "postgres_db"
    DATABASE_URL = os.getenv(
        "DATABASE_URL", 
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    logger.info(f"Using PRODUCTION database configuration: {DB_HOST}:{DB_PORT}")
    logger.info(f"Database URL: {DATABASE_URL}")
else:  # dev environment
    DB_HOST = "brahma"
    DATABASE_URL = os.getenv(
        "DATABASE_URL", 
        f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    logger.info(f"Using DEVELOPMENT database configuration: {DB_HOST}:{DB_PORT}")
    logger.info(f"Database URL: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
