"""
FAISS Index Builder

Builds a vector similarity search index for all songs in the database,
enabling fast nearest-neighbor searches based on audio features.

Usage:
    python -m backend.scripts.manage_data index
"""

import faiss
import numpy as np
from pathlib import Path
import pickle
import os
import logging

from backend.api import create_app
from backend.api.database.models import Song
from backend.constants import (
    AUDIO_FEATURES,
    FAISS_INDEX_PATH,
    FAISS_IDS_PATH,
    FEATURE_STATS_PATH
)

# Configure logging
logger = logging.getLogger(__name__)

def build_faiss_index():
    """Build and save FAISS index for all songs in the database"""
    logger.info("Starting FAISS index building process")
    
    app = create_app()
    with app.app_context():
        # Query all songs
        logger.info("Loading songs from database...")
        songs = Song.query.all()
        logger.info(f"Found {len(songs)} songs")
        
        # Extract features and IDs
        feature_matrix = []
        song_ids = []
        
        logger.info("Extracting feature vectors...")
        for song in songs:
            # Create feature vector
            features = [getattr(song, col.lower()) for col in AUDIO_FEATURES]
            feature_matrix.append(features)
            song_ids.append(song.song_id)
        
        # Convert to numpy array and ensure float32 type for FAISS
        X = np.array(feature_matrix).astype('float32')
        song_ids = np.array(song_ids)
        
        # Calculate and save feature statistics for normalization during search
        feature_stats = {
            'mean': X.mean(axis=0),
            'std': X.std(axis=0)
        }
        
        # Normalize features for cosine similarity
        X_normalized = (X - feature_stats['mean']) / feature_stats['std']
        
        # Build the index
        dimension = len(AUDIO_FEATURES)
        index = faiss.IndexFlatL2(dimension)  # L2 distance index
        
        # Add vectors to the index
        index.add(X_normalized)
        
        # Save the index, song IDs, and feature statistics
        logger.info(f"Saving index to {FAISS_INDEX_PATH}")
        os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
        faiss.write_index(index, str(FAISS_INDEX_PATH))
        
        logger.info(f"Saving song IDs to {FAISS_IDS_PATH}")
        with open(FAISS_IDS_PATH, 'wb') as f:
            pickle.dump(song_ids, f)
            
        logger.info(f"Saving feature statistics to {FEATURE_STATS_PATH}")
        with open(FEATURE_STATS_PATH, 'wb') as f:
            pickle.dump(feature_stats, f)
            
        logger.info(f"✅ FAISS index built successfully with {len(song_ids)} songs")