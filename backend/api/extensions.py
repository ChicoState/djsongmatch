"""
Central registry for Flask extensions

Purpose:
    - Centralized extension initialization
    - Prevents circular imports
    - Enables sharing across all application components
"""

from flask_sqlalchemy import SQLAlchemy

# Database instance (import this instead of SQLAlchemy directly)
# Example usage in other files:
#   from api.extensions import db
#   db.create_all()  # etc.

SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_size": 10,  # Number of connections in the pool
    "max_overflow": 5,  # Additional connections beyond the pool size
    "pool_timeout": 30,  # Timeout for getting a connection from the pool
    "pool_recycle": 1800,  # Recycle connections after 30 minutes
    "pool_pre_ping": True,  # Check if connections are alive before using them
}

db = SQLAlchemy(engine_options=SQLALCHEMY_ENGINE_OPTIONS)

# -------------------------------
# Example future extension pattern:
# from flask_extension import ClassName
# ext_var = ClassName()
# -------------------------------
# Example potential future extensions:
#   - Flask login manager for authentication
#   - Flash caching
#   - Flask admin