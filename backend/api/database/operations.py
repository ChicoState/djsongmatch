# database/operations.py
from sqlalchemy.exc import IntegrityError
from typing import List
from api.database.models import Song, CamelotKey
from api.extensions import db

def insert_songs(songs: List[Song]) -> int:
    """
    Bulk insert songs with duplicate prevention and fallback logic
    Returns: Number of successfully inserted songs
    """
    success_count = 0
    
    try:
        # Get existing IDs (single query)
        existing_ids = {s[0] for s in db.session.query(Song.song_id).all()}
        new_songs = [s for s in songs if s.song_id not in existing_ids]
        
        if not new_songs:
            print("No new songs to insert")
            return 0
        
        # Attempt bulk insert
        db.session.bulk_save_objects(new_songs)
        db.session.commit()
        success_count = len(new_songs)
        
    except IntegrityError as bulk_error:  # More specific exception
        db.session.rollback()
        print(f"Bulk insert failed, falling back to individual inserts: {bulk_error}")
        
        # Individual insert fallback
        for song in new_songs:
            try:
                db.session.merge(song)
                success_count += 1
                
                # Periodic commit
                if success_count % 100 == 0:
                    db.session.commit()
                    
            except Exception as single_error:
                db.session.rollback()
                print(f"Failed to insert song {song.song_id}: {single_error}")
        
        db.session.commit()

    print(f"Added {success_count} songs to the database")
    return success_count


def init_camelot_keys():
    """
    Resets CamelotKey table with standard keys.
    WARNING: Drops all existing data!
    """
    try:
        # Clear existing data
        db.session.query(CamelotKey).delete()

        # Camelot_Keys to be inserted
        camelot_keys = [
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

        db.session.bulk_save_objects(camelot_keys)
        db.session.commit()
        print(f"Initialized {len(camelot_keys)} Camelot keys")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing Camelot keys: {str(e)}")
        raise