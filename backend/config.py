"""
Application Configuration

Purpose:
    - Centralized configuration management for the Flask application
    - Supports multiple environments (development, production)

Key Features:
    - Loads environment variables from a `.env` file
    - Provides database connection settings
    - Enables environment-specific configurations

Configuration Options:
    - `development`: Debug mode enabled, auto-reloader
    - `production`: Optimized for deployment
    - `default`: Defaults to development configuration

Usage Example:
    from backend.config import selected_config
    app.config.from_object(selected_config)

Setting FLASK_ENV:
    - Locally: Add FLASK_ENV to the `.env` file (e.g., FLASK_ENV=development)
    - Docker: Set FLASK_ENV in the `docker-compose.yml` file under `environment`
    - Terminal: Export FLASK_ENV before running the app (e.g., export FLASK_ENV=production)
"""

import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent

# Load environment variables from .env file
load_dotenv(BASE_DIR / ".env")

class Config:
    """
    Base configuration class
    Attributes:
        SQLALCHEMY_DATABASE_URI (str): Database connection string
        SQLALCHEMY_TRACK_MODIFICATIONS (bool): Disable SQLAlchemy event system
    """
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """
    Development configuration
    Attributes:
        DEBUG (bool): Enables debug mode
    """
    DEBUG = True
    ENV = "development"

class ProductionConfig(Config):
    """
    Production configuration
    Attributes:
        DEBUG (bool): Disables debug mode
    """
    DEBUG = False
    ENV = "production"

# Configuration dictionary for environment selection
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}

# Dynamically select the configuration class based on FLASK_ENV
selected_config = config.get(os.getenv("FLASK_ENV", "default"))
if selected_config is None:
    print(f"Warning: Invalid FLASK_ENV value. Defaulting to DevelopmentConfig.")
    selected_config = config["default"]