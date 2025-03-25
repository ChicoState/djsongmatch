import pathlib
from typing import Generator
import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from db.models import Base, CamelotKey, Song
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.parent # src
DEFAULT_DB_PATH = PROJECT_ROOT / "db" / "ClassicHit.db"
DEFAULT_DB_URL = f"sqlite:///{DEFAULT_DB_PATH}"

engine = sqlalchemy.create_engine(DEFAULT_DB_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """Dependency for getting DB session (FastAPI style)"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize DB (drop and create all)"""
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

def insert_camelot_keys(db: Session, keys: list[CamelotKey]):
    """Bulk insert camelot keys using existing session with duplicate prevention."""
    
    # Get existing camelot keys for duplicate check
    existing_ids = {k[0] for k in db.query(CamelotKey.id).all()}
    new_keys = [k for k in keys if k.id not in existing_ids]
    
    if new_keys:
        db.bulk_save_objects(new_keys)
        db.commit()

def insert_songs(db: Session, songs: list[Song]):
    """Bulk insert songs using existing session with duplicate prevention."""
    
    # Get existing song IDs for duplicate check
    existing_ids = {s[0] for s in db.query(Song.song_id).all()}
    new_songs = [s for s in songs if s.song_id not in existing_ids]
    
    if not new_songs:
        return
    
    try:
        # First try bulk insert for performance
        db.bulk_save_objects(new_songs)
        db.commit()
    except Exception as bulk_error:
        db.rollback()
        print(f"Bulk insert failed, falling back to individual inserts: {bulk_error}")
        
        # Fallback to merge for each song
        success_count = 0
        for song in new_songs:
            try:
                db.add(song)
                success_count += 1
                # Commit periodically to avoid huge transactions
                if success_count % 100 == 0:
                    db.commit()
            except Exception as single_error:
                db.rollback()
                print(f"Failed to insert song {song.song_id}: {single_error}")
        
        db.commit()