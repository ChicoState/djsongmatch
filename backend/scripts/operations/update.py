"""
Database Update Operations

Provides functionality for updating existing song records in the database without
rebuilding the entire database. This is useful when audio feature pre-porcessing
has been refined.

This module is primarily used by the manage_data.py CLI, but the core
functions can also be imported and used programmatically.

Features:
- Batch processing with automatic retry logic
- Failure tracking for interrupted operations
- Resume capability for previously failed updates

Usage:
    # From manage_data.py
    from backend.scripts.operations.update import update_existing_songs
    update_existing_songs(retry_only=False)
"""

import pandas as pd
import logging
import json
import os
from pathlib import Path
from typing import List, Dict, Any, Set

from backend.api.database.models import Song
from backend.api.extensions import db
from backend.constants import (
    AUDIO_FEATURES,
    PROCESSED_CSV_PATH,
    ASSETS_DIR
)

# Configure logging
logger = logging.getLogger(__name__)

# File to store failed updates for retry operations
FAILED_UPDATES_FILE = ASSETS_DIR / "failed_updates.json"

# Processing configuration
BATCH_SIZE = 500
MAX_RETRIES = 3  # Maximum number of retries for a batch

def update_existing_songs(csv_path: str = None, retry_only: bool = False) -> int:
    """
    Update the audio features for songs that already exist in the database.
    Args:
        csv_path: Path to CSV file with updated song data (uses default if None)
        retry_only: If True, only retry previously failed updates
    Returns:
        Number of songs successfully updated
    """
    # Use default path if none provided
    if csv_path is None:
        csv_path = PROCESSED_CSV_PATH
    
    # Ensure the CSV file exists
    if not Path(csv_path).exists():
        logger.error(f"CSV file not found: {csv_path}")
        return 0
    
    logger.info(f"Loading data from {csv_path}")
    df = pd.read_csv(csv_path)
    
    # Convert column names to lowercase for consistency with database
    df.columns = df.columns.str.lower()
    
    # Get existing song IDs
    logger.info("Retrieving song IDs from database...")
    song_ids_in_db = set(id[0] for id in db.session.query(Song.song_id).all())
    logger.info(f"Found {len(song_ids_in_db)} songs in database")
    

    logger.info("Converting data to update format...")
    # Convert relevant columns to a list of dictionaries
    update_data = df[['song_id'] + [f.lower() for f in AUDIO_FEATURES]].to_dict('records')
    
    # Filter to only include songs that exist in the database
    all_songs = [row for row in update_data if row['song_id'] in song_ids_in_db]
    logger.info(f"Found {len(all_songs)} songs in CSV that exist in database")
    
    # Check for failed updates from previous runs if retry mode is enabled
    failed_ids = _load_failed_ids() if retry_only else set()
    
    # Filter songs based on retry flag
    if retry_only and failed_ids:
        songs_to_update = [row for row in all_songs if row['song_id'] in failed_ids]
        logger.info(f"Retrying updates for {len(songs_to_update)} previously failed songs")
    else:
        songs_to_update = all_songs
    
    if not songs_to_update:
        logger.info("No songs to update.")
        return 0
        
    logger.info(f"Updating {len(songs_to_update)} songs in batches of {BATCH_SIZE}")
    
    # Process updates in batches
    result = _process_update_batches(songs_to_update)
    
    # Log the final results
    if result['failed']:
        _save_failed_ids(result['failed'])
        logger.warning(f"⚠️ {len(result['failed'])} songs failed to update. Run with --retry to try again.")
    else:
        # Remove the failed updates file if all updates succeeded
        if os.path.exists(FAILED_UPDATES_FILE):
            os.remove(FAILED_UPDATES_FILE)
            logger.info("✅ Cleared previous failure records")
    
    logger.info(f"✅ Successfully updated {result['success_count']} songs with new feature values")
    return result['success_count']
    
def _process_update_batches(songs_to_update: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Process song updates in batches with retry logic
    
    Args:
        songs_to_update: List of song dictionaries with updates to apply
        
    Returns:
        Dict containing success_count and failed song IDs
    """
    # Track metrics
    total_updated = 0
    failed_batches = {}
    
    # Process in batches
    for i in range(0, len(songs_to_update), BATCH_SIZE):
        batch = songs_to_update[i:i + BATCH_SIZE]
        batch_ids = [row['song_id'] for row in batch]
        retry_count = 0
        success = False
        
        # Try updating with retries
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
    
    # Extract all failed song IDs
    failed_song_ids = []
    for batch_data in failed_batches.values():
        failed_song_ids.extend(batch_data["song_ids"])
    
    return {
        'success_count': total_updated,
        'failed': failed_song_ids,
        'failed_batches': failed_batches
    }

def _load_failed_ids() -> Set[int]:
    """Load previously failed song IDs from file"""
    failed_ids = set()
    
    if os.path.exists(FAILED_UPDATES_FILE):
        try:
            with open(FAILED_UPDATES_FILE, 'r') as f:
                failed_data = json.load(f)
                failed_ids = set(failed_data.get('failed_song_ids', []))
                logger.info(f"Found {len(failed_ids)} previously failed song IDs to retry")
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Error loading failed updates file: {e}")
    
    return failed_ids


def _save_failed_ids(failed_ids: List[int], batch_data: Dict = None) -> None:
    """Save failed song IDs to file for later retry"""
    if not failed_ids:
        return
        
    save_data = {
        "failed_song_ids": failed_ids
    }
    
    if batch_data:
        save_data["batches"] = list(batch_data.values())
    
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(FAILED_UPDATES_FILE), exist_ok=True)
        
        with open(FAILED_UPDATES_FILE, 'w') as f:
            json.dump(save_data, f, indent=2)
            
        logger.info(f"Saved {len(failed_ids)} failed song IDs to {FAILED_UPDATES_FILE}")
    except IOError as e:
        logger.error(f"Failed to save failed updates file: {e}")