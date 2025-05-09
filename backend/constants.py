"""
Centralized constants for the DJ Song Match application.

This module defines constants that are used across multiple files to ensure consistency
and reduce duplication. Import these constants rather than redefining them in each file.
"""

# Song audio features used for recommendations and clustering
AUDIO_FEATURES = [
    'danceability', 
    'energy', 
    'loudness', 
    'speechiness',
    'acousticness', 
    'instrumentalness', 
    'liveness', 
    'valence'
]

# Path configurations
from pathlib import Path

# Base paths
BACKEND_ROOT = Path(__file__).parent
ASSETS_DIR = BACKEND_ROOT / "assets"

# CSV paths
RAW_CSV_PATH = ASSETS_DIR / "ClassicHit.csv"
PROCESSED_CSV_PATH = ASSETS_DIR / "Processed_ClassicHit.csv"

# Model paths
KMEANS_MODEL_PATH = ASSETS_DIR / "kmeans_model.pkl"
FAISS_INDEX_PATH = ASSETS_DIR / "faiss_index.bin"
FAISS_IDS_PATH = ASSETS_DIR / "faiss_song_ids.pkl"
FEATURE_STATS_PATH = ASSETS_DIR / "feature_stats.pkl"