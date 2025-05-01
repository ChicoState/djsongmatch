import pandas as pd
import logging
import json
import os
from backend.api import create_app
from backend.api.database.models import Song
from backend.api.extensions import db
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

CSV_PATH = Path(__file__).parent.parent / "assets" / "Processed_ClassicHit.csv"
FAILED_UPDATES_FILE = Path(__file__).parent / "failed_updates.json"

FEATURE_COLS = [
    'danceability', 'energy', 'loudness', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence'
]

BATCH_SIZE = 500
MAX_RETRIES = 3  # Maximum number of retries for a batch

def update_existing_songs(retry_only=False):
    """Update the audio features for songs that already exist in the database.
    
    Args:
        retry_only (bool): If True, only retry previously failed updates
    """
    logger.info(f"Loading data from {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    
    # Convert column names to lowercase for consistency with database
    df.columns = df.columns.str.lower()
    
    app = create_app()
    with app.app_context():
        # Get existing song IDs
        logger.info("Retrieving song IDs from database...")
        song_ids_in_db = set(id[0] for id in db.session.query(Song.song_id).all())
        logger.info(f"Found {len(song_ids_in_db)} songs in database")
        
        logger.info("Converting data to update format...")
        # Convert relevant columns to a list of dictionaries
        update_data = df[['song_id'] + FEATURE_COLS].to_dict('records')
        
        # Filter to only include songs that exist in the database
        all_songs = [row for row in update_data if row['song_id'] in song_ids_in_db]
        
        # Check for failed updates from previous runs
        failed_ids = set()
        if retry_only and os.path.exists(FAILED_UPDATES_FILE):
            with open(FAILED_UPDATES_FILE, 'r') as f:
                failed_data = json.load(f)
                failed_ids = set(failed_data.get('failed_song_ids', []))
                logger.info(f"Found {len(failed_ids)} previously failed song IDs to retry")
        
        # Filter songs based on retry flag
        if retry_only and failed_ids:
            songs_to_update = [row for row in all_songs if row['song_id'] in failed_ids]
        else:
            songs_to_update = all_songs
        
        if not songs_to_update:
            logger.info("No songs to update.")
            return
            
        logger.info(f"Updating {len(songs_to_update)} songs in batches of {BATCH_SIZE}")
        
        # Track failed updates
        failed_batches = {}
        
        # Process in batches
        total_updated = 0
        for i in range(0, len(songs_to_update), BATCH_SIZE):
            batch = songs_to_update[i:i + BATCH_SIZE]
            batch_ids = [row['song_id'] for row in batch]
            retry_count = 0
            success = False
            
            while not success and retry_count < MAX_RETRIES:
                try:
                    db.session.bulk_update_mappings(Song, batch)
                    db.session.commit()
                    total_updated += len(batch)
                    logger.info(f"Updated batch {i//BATCH_SIZE + 1}/{(len(songs_to_update)-1)//BATCH_SIZE + 1}")
                    success = True
                except Exception as e:
                    retry_count += 1
                    db.session.rollback()
                    logger.warning(f"Error updating batch {i//BATCH_SIZE + 1} (attempt {retry_count}/{MAX_RETRIES}): {e}")
                    
                    if retry_count >= MAX_RETRIES:
                        logger.error(f"Failed to update batch after {MAX_RETRIES} attempts")
                        failed_batches[i] = {
                            "batch_index": i,
                            "song_ids": batch_ids,
                            "error": str(e)
                        }
        
        # Save failed song IDs to a file for later retry
        if failed_batches:
            failed_song_ids = []
            for batch_data in failed_batches.values():
                failed_song_ids.extend(batch_data["song_ids"])
            
            with open(FAILED_UPDATES_FILE, 'w') as f:
                json.dump({"failed_song_ids": failed_song_ids, "batches": list(failed_batches.values())}, f, indent=2)
            
            logger.warning(f"⚠️ {len(failed_song_ids)} songs failed to update. Run with --retry to try again.")
        else:
            # Remove the failed updates file if all updates succeeded
            if os.path.exists(FAILED_UPDATES_FILE):
                os.remove(FAILED_UPDATES_FILE)
        
        logger.info(f"✅ Successfully updated {total_updated} songs with new feature values")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Update song features in the database.')
    parser.add_argument('--retry', action='store_true', help='Only retry previously failed updates')
    args = parser.parse_args()
    
    update_existing_songs(retry_only=args.retry)