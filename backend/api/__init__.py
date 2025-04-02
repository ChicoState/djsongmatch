from pathlib import Path

from flask import Flask

from api.extensions import db

from .routes.camelot_keys import camelot_keys_bp
from .routes.songs import songs_bp


# def create_app(config_object="settings.py"): # can create settings.py
def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Configure
    # app.config.from_pyfile(config_object) # add if using a settings.py file
    BASE_DIR = Path(__file__).parent.parent.parent
    DB_PATH = BASE_DIR / "db.db"

    # Ensure instance directory exists
    DB_PATH.parent.mkdir(exist_ok=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(songs_bp, url_prefix="/api/songs")
    app.register_blueprint(camelot_keys_bp, url_prefix="/api/camelot_keys")

    return app

