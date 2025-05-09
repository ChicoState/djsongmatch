"""
Database Seeding Operations

Provides functions for initializing and populating the music database with:
1. Standard Camelot wheel key notations
2. Song data from CSV files

This module is primarily used by the manage_data.py CLI, but the core
functions can also be imported and used programmatically if needed.

Key Features:
- Atomic operations with automatic rollback on failure
- Bulk insert with duplicate detection
- Fallback to individual inserts when needed
- Progress tracking and detailed error reporting

Usage:
    # From manage_data.py
    from backend.scripts.operations.seed import seed_database
    seed_database(refresh=True)  # refresh=False keeps existing tables
"""

from pathlib import Path
import pandas as pd
from typing import List, Optional
import logging
import sys
from sqlalchemy.exc import IntegrityError

from backend.api import create_app
from backend.api.extensions import db
from backend.api.database.models import Song, CamelotKey
from backend.constants import PROCESSED_CSV_PATH

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Standard Camelot data
# IDs are mapped using the Camelot wheel numbering system:
#   minors (Camelot wheel 1-12A) : 1-12
#   majors (Camelot wheel 1-12B) : 13-24
# Keys are mapped 0-11 in Alphabetical order starting at C
# Mode is mapped as:
#   minor : 0
#   major : 1
CAMELOT_KEYS = [
    CamelotKey(id=1, key=8, mode=0, key_str="G#/Ab min"),
    CamelotKey(id=2, key=3, mode=0, key_str="D#/Eb min"),
    CamelotKey(id=3, key=10, mode=0, key_str="A#/Bb min"),
    CamelotKey(id=4, key=5, mode=0, key_str="F min"),
    CamelotKey(id=5, key=0, mode=0, key_str="C min"),
    CamelotKey(id=6, key=7, mode=0, key_str="G min"),
    CamelotKey(id=7, key=2, mode=0, key_str="D min"),
    CamelotKey(id=8, key=9, mode=0, key_str="A min"),
    CamelotKey(id=9, key=4, mode=0, key_str="E min"),
    CamelotKey(id=10, key=11, mode=0, key_str="B min"),
    CamelotKey(id=11, key=6, mode=0, key_str="F#/Gb min"),
    CamelotKey(id=12, key=1, mode=0, key_str="C#/Db min"),
    CamelotKey(id=13, key=11, mode=1, key_str="B Maj"),
    CamelotKey(id=14, key=6, mode=1, key_str="F#/Gb Maj"),
    CamelotKey(id=15, key=1, mode=1, key_str="C#/Db Maj"),
    CamelotKey(id=16, key=8, mode=1, key_str="G#/Ab Maj"),
    CamelotKey(id=17, key=3, mode=1, key_str="D#/Eb Maj"),
    CamelotKey(id=18, key=10, mode=1, key_str="A#/Bb Maj"),
    CamelotKey(id=19, key=5, mode=1, key_str="F Maj"),
    CamelotKey(id=20, key=0, mode=1, key_str="C Maj"),
    CamelotKey(id=21, key=7, mode=1, key_str="G Maj"),
    CamelotKey(id=22, key=2, mode=1, key_str="D Maj"),
    CamelotKey(id=23, key=9, mode=1, key_str="A Maj"),
    CamelotKey(id=24, key=4, mode=1, key_str="E Maj"),
]

def seed_camelot_keys() -> int:
    """
    Initializes the Camelot keys table with standard music theory notations.
    WARNING: Completely replaces existing keys!
    
    Returns:
        int: Number of keys inserted (24 if successful, 0 on failure)
    """
    try:
        # Clear existing data
        db.session.query(CamelotKey).delete()
        
        # Insert fresh data
        db.session.bulk_save_objects(CAMELOT_KEYS)
        db.session.commit()
        logger.info(f"Success! Seeded {len(CAMELOT_KEYS)} Camelot keys")
        return len(CAMELOT_KEYS)
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to seed Camelot keys: {str(e)}")
        return 0
        
        
def seed_songs_from_csv(csv_path: str) -> int:
    """
    Bulk insert songs from CSV file matching the expected schema.
    Automatically skips duplicates.
    Args:
        csv_path: Path to CSV file with song data
    Returns: Number of successfully inserted songs
    """
    logger.info(f"Reading songs from {csv_path}")
    df = pd.read_csv(csv_path)
    logger.info(f"Found {len(df)} songs in CSV file")

    df = df.drop_duplicates(subset=["Artist", "Track"])
    logger.info(f"After de-duplication: {len(df)} songs")

    songs = [
        Song(
            song_id=row['Song_ID'],
            title=row['Track'],
            artist=row['Artist'],
            year=row['Year'],
            duration=row['Duration'],
            time_signature=row['Time_Signature'],
            camelot_key_id=row['Camelot_Key'],
            tempo=row['Tempo'],
            danceability=row['Danceability'],
            energy=row['Energy'],
            loudness=row['Loudness'],
            loudness_dB=row['Loudness_dB'],
            speechiness=row['Speechiness'],
            acousticness=row['Acousticness'],
            instrumentalness=row['Instrumentalness'],
            liveness=row['Liveness'],
            valence=row['Valence'],
            popularity=row['Popularity'],
            genre=row['Genre']
        )
        for _, row in df.iterrows()
    ]
    return _bulk_insert_songs(songs)


def _bulk_insert_songs(songs: List['Song']) -> int:
    """
    Bulk insert songs with duplicate prevention and fallback logic
    Args:
        songs: List of Song model instances
    Returns:
        Number of successfully inserted songs
    """
    if not songs:
        return 0

    # Get existing song IDs
    existing_ids = {s[0] for s in db.session.query(Song.song_id).all()}
    new_songs = [s for s in songs if s.song_id not in existing_ids]

    if not new_songs:
        logger.info("No new songs to insert (all already exist)")
        return 0

    # Attempt bulk insert
    try:
        db.session.bulk_save_objects(new_songs)
        db.session.commit()
        logger.info(f"Successfully bulk inserted {len(new_songs)} songs")
        return len(new_songs)
    except IntegrityError:
        db.session.rollback()
        logger.warning("Bulk insert failed, falling back to individual inserts")
        return _insert_songs_individually(new_songs)


def _insert_songs_individually(songs: List['Song']) -> int:
    """
    Fallback for individual song insertion
    Args:
        songs: List of Song model instances
    Returns:
        Number of successfully inserted songs
    """
    success = 0
    total = len(songs)
    for i, song in enumerate(songs, 1):
        try:
            db.session.merge(song)
            success += 1
            if i % 100 == 0:  # Periodic commit
                db.session.commit()
                logger.info(f"Progress: {i}/{total} songs processed")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error inserting song {song.song_id}: {str(e)}")
    
    db.session.commit()
    logger.info(f"Individual insert complete: {success}/{total} songs succeeded")
    return success

def seed_database(csv_path: Optional[str] = None, refresh: bool = True) -> int:
    """
    Initialize the database with Camelot keys and songs
    Args:
        csv_path: Path to CSV file with song data (if None, uses default)
        refresh: Whether to drop and recreate all tables (True) or preserve existing (False)
    Returns:
        Number of songs added
    """
    # Use the default path if none provided
    if csv_path is None:
        csv_path = PROCESSED_CSV_PATH
    
    # Ensure the CSV file exists
    if not Path(csv_path).exists():
        logger.error(f"CSV file not found: {csv_path}")
        return 0

    logger.info(f"Starting database seeding process (refresh={refresh})")
    
    if refresh:
        logger.info("Dropping all tables...")
        db.drop_all()
        db.create_all()

    # Seed the Camelot keys
    logger.info("Seeding Camelot keys...")
    key_count = seed_camelot_keys()
    
    # Seed the songs
    logger.info("Importing songs...")
    song_count = seed_songs_from_csv(csv_path)
    
    logger.info(f"✅ Database seeding complete! Added {key_count} keys and {song_count} songs")
    return song_count