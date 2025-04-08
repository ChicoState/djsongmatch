"""
Flask Application Factory

Core Responsibilities:
1. Creates and configures Flask application instances
2. Initializes extensions with Flask (SQLAlchemy, etc.)
3. Registers API routes (blueprints)
4. Ensures database tables exist

Configuration Options:
- 'default': Derived from config.py config[default]
- 'development': Debug mode, auto-reloader
- 'production': Optimized for deployment

Example Usage:
    # Basic server startup
    from backend.api import create_app
    app = create_app('development')
    app.run(host='0.0.0.0', port=5001)

    # Database operations
    with app.app_context():
        from backend.api.extensions import db
        # Example: Query all songs
        songs = db.session.query(Song).all()
"""
from flask import Flask
from backend.config import selected_config
from backend.api.extensions import db

def create_app():
    """
    Application factory main entry point
    Returns:
        Flask: Configured application instance
    """
    app = Flask(__name__)

    # Load dynamically selected configuration from config.py
    app.config.from_object(selected_config)

    # Initialize the SQLAlchemy database connection with the Flask application
    # This binds the db instance to this specific Flask app configuration
    db.init_app(app)

    # Register API routes (blueprints)
    from .routes.camelot_keys import camelot_keys_bp
    from .routes.songs import songs_bp

    app.register_blueprint(songs_bp, url_prefix="/api/songs")
    app.register_blueprint(camelot_keys_bp, url_prefix="/api/camelot_keys")

    # Create database tables if they don't exist (development only)
    if app.config["ENV"] == "development":
        with app.app_context():
            from backend.api.database.models import Song, CamelotKey
            db.create_all() # Creates tables based on models

    return app