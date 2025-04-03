"""
Database Seeding Command Line Interface

Usage:
    python scripts/run_seed.py

Description:
    Initializes a fresh database with:
    1. Clean schema (drops all existing tables)
    2. Standard Camelot music keys
    3. Song data from predefined CSV file

Configuration:
    - CSV_PATH: Points to Processed_ClassicHit.csv in assets/
    - Uses development config from create_app()
"""
from pathlib import Path
from api import create_app
from api.database.seed import (
    seed_camelot_keys,
    seed_songs_from_csv
)
from api.extensions import db

PROJECT_ROOT = Path(__file__).parent.parent
CSV_PATH = PROJECT_ROOT / "assets" / "Processed_ClassicHit.csv"

def main():
    """Execute full database seeding pipeline"""
    app = create_app(config_name='development')
    with app.app_context():
        print("Resetting database...")
        db.drop_all()
        db.create_all()

        print("Seeding Camelot keys...")
        seed_camelot_keys()

        print("Importing songs...")
        seed_songs_from_csv(CSV_PATH)

if __name__ == "__main__":
    main()