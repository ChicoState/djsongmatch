from flask import Flask
from config import config
from api.extensions import db

def create_app(config_name="default"):
    """Application factory pattern"""
    app = Flask(__name__)

    # Configure from config.py
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    from .routes.camelot_keys import camelot_keys_bp
    from .routes.songs import songs_bp

    app.register_blueprint(songs_bp, url_prefix="/api/songs")
    app.register_blueprint(camelot_keys_bp, url_prefix="/api/camelot_keys")

    # Late initialization of models
    with app.app_context():
        from api.database.models import Song, CamelotKey
        db.create_all()

    return app