import os
from pathlib import Path

from dotenv import load_dotenv
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
    BASE_DIR = Path(__file__).parents[2]

    # Source .env file
    load_dotenv(BASE_DIR / ".env")

    USER = os.getenv("user")
    PASSWORD = os.getenv("password")
    HOST = os.getenv("host")
    PORT = os.getenv("port")
    DBNAME = os.getenv("dbname")

    DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(songs_bp, url_prefix="/api/songs")
    app.register_blueprint(camelot_keys_bp, url_prefix="/api/camelot_keys")

    return app
