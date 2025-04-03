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
db = SQLAlchemy()


# -------------------------------
# Example future extension pattern:
# from flask_extension import ClassName
# ext_var = ClassName()
# -------------------------------
# Example potential future extensions:
#   - Flask login manager for authentication
#   - Flash caching
#   - Flask admin