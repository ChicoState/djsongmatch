from flask import Flask
from config import config
from api.extensions import db

def create_app(config_name="default"):
    """
    Creates and configures the Flask application instance
    Args:
        config_name: Which configuration to use ('default', 'development', or 'production')
    Returns:
        Configured Flask application instance
    Example Basic Usage:
        from api import create_app
        app = create_app()
        app.run(host='0.0.0.0', port=5001)
    """
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object(config[config_name])

    # Set up database connection
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