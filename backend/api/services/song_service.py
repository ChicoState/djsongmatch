"""
DJ Song Recommendation Service

Provides DJ-focused song recommendations using vector similarity search
with FAISS, plus music theory rules for harmonic mixing.

Features:
- Fast approximate nearest neighbor search
- Camelot wheel harmonic compatibility
- DJ-friendly tempo matching for smooth transitions
"""

import faiss
import numpy as np
import pickle
import logging
from typing import List, Dict, Any, Optional, Union

from backend.api.database.models import Song
from backend.api.services.camelot_keys_service import CamelotKeysService
from backend.constants import (
    AUDIO_FEATURES,
    FAISS_INDEX_PATH,
    FAISS_IDS_PATH,
    FEATURE_STATS_PATH
)

logger = logging.getLogger(__name__)

# Feature weights (sum to 1.0) - Can implement later if desired
# These weights can be adjusted based on DJ preferences or specific use cases
# FEATURE_WEIGHTS = {
#     'danceability': 0.25,
#     'energy': 0.25,
#     'loudness': 0.1,
#     'speechiness': 0.05,
#     'acousticness': 0.05,
#     'instrumentalness': 0.1,
#     'liveness': 0.05,
#     'valence': 0.15
# }

class SongService:
    """Basic song data operations"""
    
    @staticmethod
    def get_songs(limit: int = None) -> List[Song]:
        """
        Get all songs, optionally limited to a specific count
        Args:
            limit: Maximum number of songs to return
        Returns:
            List of Song objects
        """
        query = Song.query
        if limit:
            query = query.limit(limit)
        return query.all()
    
    @staticmethod
    def get_song(song_id: int) -> Optional[Song]:
        """
        Get a specific song by ID
        Args:
            song_id: The ID of the song to retrieve
        Returns:
            Song object if found, None otherwise
        """
        return Song.query.get(song_id)
    
    @staticmethod
    def serialize_song(song: Song) -> Dict[str, Any]:
        """
        Convert Song model to API response format
        Args:
            song: Song model instance
        Returns:
            Dictionary with serialized song data
        """
        return {
            'songId': song.song_id,
            'title': song.title,
            'artist': song.artist,
            'year': song.year,
            'tempo': song.tempo,
            'camelotKeyId': song.camelot_key_id,
            'camelotKeyStr': song.camelot_key.key_str if song.camelot_key else None,
            'genre': song.genre,
            'popularity': song.popularity,
            'duration': song.duration,
            'danceability': song.danceability,
            'energy': song.energy,
            'loudness': song.loudness,
            'speechiness': song.speechiness,
            'acousticness': song.acousticness,
            'instrumentalness': song.instrumentalness,
            'liveness': song.liveness,
            'valence': song.valence
        }

class RecommendationService:
    """Service for DJ-oriented song recommendations"""
    
    # Lazy-loaded index and related data
    _index = None
    _song_ids = None
    _feature_stats = None
    
    @classmethod
    def _load_assets(cls):
        """Load FAISS index and related data if not already loaded"""
        if cls._index is None:
            try:
                # Load FAISS index
                cls._index = faiss.read_index(str(FAISS_INDEX_PATH))
                
                # Load song IDs mapping
                with open(FAISS_IDS_PATH, 'rb') as f:
                    cls._song_ids = pickle.load(f)
                
                # Load feature statistics for normalization
                with open(FEATURE_STATS_PATH, 'rb') as f:
                    cls._feature_stats = pickle.load(f)
                    
                # # Create weighted index if it doesn't exist
                # if not hasattr(cls._index, 'is_weighted'):
                #     cls._apply_feature_weights()
                    
                logger.info(f"Loaded FAISS index with {len(cls._song_ids)} songs")
            except Exception as e:
                logger.error(f"Failed to load FAISS index: {e}")
                raise
    
    # @classmethod
    # def _apply_feature_weights(cls):
    #     """Apply DJ-specific feature weights to the index"""
    #     # Extract the vectors
    #     d = cls._index.d
    #     n = cls._index.ntotal
        
    #     # Get the raw vectors
    #     vectors = np.zeros((n, d), dtype=np.float32)
    #     for i in range(n):
    #         cls._index.reconstruct(i, vectors[i])
        
    #     # Apply weights
    #     weights = np.array([FEATURE_WEIGHTS.get(feature.lower(), 1.0) 
    #                       for feature in AUDIO_FEATURES], dtype=np.float32)
    #     weighted_vectors = vectors * weights
        
    #     # Create new index with weighted vectors
    #     new_index = faiss.IndexFlatL2(d)
    #     new_index.add(weighted_vectors)
    #     new_index.is_weighted = True
        
    #     # Replace old index
    #     cls._index = new_index

    @classmethod
    def _is_compatible_tempo(cls, base_tempo: float, 
                             candidate_tempo: float, 
                             direct_tolerance: float = 4.0,
                             half_double_tolerance: float = 2.0
                             ) -> bool:
        """
        Check if the candidate tempo is compatible with the base tempo,
        considering normal, half-time, and double-time matches.
        
        Args:
            base_tempo: The reference tempo in BPM
            candidate_tempo: The tempo to check for compatibility
            direct_tolerance: Allowable BPM difference for direct match
            half_double_tolerance: Allowable BPM difference for half/double match
            
        Returns:
            True if tempos are compatible, False otherwise
        """
        # Direct tempo match (within tolerance)
        if abs(base_tempo - candidate_tempo) <= direct_tolerance:
            return True
            
        # Half-time match (within tolerance)
        half_tempo = base_tempo / 2
        if abs(half_tempo - candidate_tempo) <= half_double_tolerance:
            return True
            
        # Double-time match (within tolerance)
        double_tempo = base_tempo * 2
        if abs(double_tempo - candidate_tempo) <= half_double_tolerance:
            return True
            
        return False
    
    @classmethod
    def get_similar_songs(
        cls, 
        base_song_id: int,
        tempo_tolerance: float = 4.0,
        start_year: int = 0,
        end_year: int = 3000,
        danceability: Optional[float] = None,
        energy: Optional[float] = None,
        loudness: Optional[float] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Get DJ-optimized song recommendations using FAISS similarity search
        
        Args:
            base_song_id: Reference song ID
            tempo_range: BPM range (+/-) for mixing compatibility
            start_year/end_year: Filter by year range
            danceability/energy/loudness: Override feature values in the query
            limit: Maximum results to return
            
        Returns:
            List of song recommendations with similarity scores and metadata
        """
        # Load index if needed
        cls._load_assets()
        
        # Get base song from database
        base_song =  SongService.get_song(base_song_id)
        if not base_song:
            raise ValueError(f"Song with ID {base_song_id} not found")
        
        # Find the song in the FAISS index
        song_index = np.where(cls._song_ids == base_song_id)[0]
        if len(song_index) == 0:
            raise ValueError(f"Song ID {base_song_id} not found in FAISS index")
        
        # Get compatible keys and their compatibility types
        compatible_keys = CamelotKeysService.get_compatible_keys(
            base_song.camelot_key_id, as_dict=True
        )
        compatible_key_ids = set(key['id'] for key in compatible_keys)
        key_compatibility_types = {
            key['id']: key['compatibility_type']
            for key in compatible_keys
        }
        
        # Create query vector - either from song or with overrides
        query_features = []
        for feature in AUDIO_FEATURES:
            feature = feature.lower()
            if feature == 'danceability' and danceability is not None:
                query_features.append(danceability)
            elif feature == 'energy' and energy is not None:
                query_features.append(energy)
            elif feature == 'loudness' and loudness is not None:
                query_features.append(loudness)
            else:
                query_features.append(getattr(base_song, feature))
        
        # Normalize the query vector using stored statistics
        query_vector = np.array([query_features], dtype=np.float32)
        query_vector = (query_vector - cls._feature_stats['mean']) / cls._feature_stats['std']
        
        # Apply weights to query
        # weights = np.array([FEATURE_WEIGHTS.get(feature.lower(), 1.0) 
        #                   for feature in AUDIO_FEATURES], dtype=np.float32)
        # query_vector = query_vector * weights
        

        # Search with FAISS – overfetch then filter in bulk
        search_k = min(limit * 20, len(cls._song_ids))
        distances, indices = cls._index.search(query_vector, search_k)
        similarities = 1.0 / (1.0 + distances[0])

        # Build list of (song_id, similarity), exclude base song
        raw = [
            (int(cls._song_ids[idx]), similarities[i])
            for i, idx in enumerate(indices[0])
            if int(cls._song_ids[idx]) != base_song_id
        ][:search_k]

        # Bulk-fetch songs from DB
        ids = [sid for sid, _ in raw]
        songs = Song.query.filter(Song.song_id.in_(ids)).all()
        song_map = {s.song_id: s for s in songs}

        # Filter and collect results
        candidates = []
        for song_id, sim in raw:
            song = song_map.get(song_id)
            if not song:
                continue
            if song.camelot_key_id not in compatible_key_ids:
                continue
            if not cls._is_compatible_tempo(base_song.tempo, song.tempo, tempo_tolerance):
                continue
            if song.year < start_year or song.year > end_year:
                continue
            candidates.append({
                'song': song,
                'similarity': float(sim),
                'compatibility_type': key_compatibility_types.get(song.camelot_key_id)
            })
            if len(candidates) >= limit:
                break

        # Final sort and return
        candidates.sort(key=lambda x: x['similarity'], reverse=True)
        return candidates