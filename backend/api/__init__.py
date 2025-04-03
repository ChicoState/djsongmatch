"""
Flask Application Factory

Core Responsibilities:
1. Creates and configures Flask application instances
2. Initializes extensions (SQLAlchemy, etc.)
3. Registers API blueprints
4. Ensures database tables exist

Configuration Options:
- 'default': Basic configuration
- 'development': Debug mode, auto-reloader
- 'production': Optimized for deployment

Initialization Flow:
1. Load configuration
2. Setup database
3. Register routes
4. Verify tables

Example Usage:
    # Basic server startup
    from api import create_app
    app = create_app('development')
    app.run(host='0.0.0.0', port=5001)

    # Database operations
    with app.app_context():
        from api.extensions import db
        db.session.query(...)
"""
from flask import Flask
from config import config
from api.extensions import db

def create_app(config_name="default"):
    """
    Application factory main entry point
    Args:
        config_name: Configuration profile name ('default'|'development'|'production')
    Returns:
        Flask: Configured application instance
    """
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object(config[config_name])

    # Initialize the SQLAlchemy database connection with the Flask application
    # This binds the db instance to this specific Flask app configuration
    db.init_app(app)

    # Register API routes (blueprints)
    from .routes.camelot_keys import camelot_keys_bp
    from .routes.songs import songs_bp

    app.register_blueprint(songs_bp, url_prefix="/api/songs")
    app.register_blueprint(camelot_keys_bp, url_prefix="/api/camelot_keys")

    # Create database tables (if they don't exist)
    with app.app_context():
        from api.database.models import Song, CamelotKey
        db.create_all() # Creates tables based on models

    return app