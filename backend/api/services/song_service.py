# backend/api/services/song_service.py
import os
import pathlib
import pickle
from typing import List

from backend.api.database.models import Song
from backend.api.services.camelot_keys_service import CamelotKeysService


class SongService:
    @staticmethod
    def get_songs() -> List[Song]:
        """Get all songs"""
        return Song.query.all()

    @staticmethod
    def get_song(song_id: int) -> Song:
        """Get single song by ID"""
        return Song.query.get(song_id)

    @staticmethod
    def get_cluster_for_input(
        base_features: dict,
        danceability_contrast: float = 0.0,
        energy_contrast: float = 0.0,
        loudness_contrast: float = 0.0,
    ) -> int:
        """
        Adjust the base features using contrast adjustments and predict the cluster
        using the preloaded KMeans model.

        Parameters:
        - base_features: Dict with keys 'danceability', 'energy', 'loudness'
        - Contrast adjustments to modify the features.

        Returns:
        - Predicted cluster as an integer.
        """

        # Load the pre-trained clustering model. Make sure cluster.py has been run and the model file exists.
        SCRIPT_DIR = pathlib.Path(os.path.abspath(__file__))
        SCRIPT_PARENT = SCRIPT_DIR.parents[2]
        MODEL_FILENAME = SCRIPT_PARENT / "assets" / "kmeans_model.pkl"

        try:
            with open(MODEL_FILENAME, "rb") as f:
                kmeans_model = pickle.load(f)
        except FileNotFoundError:
            kmeans_model = None
            print(
                f"Warning: {MODEL_FILENAME} not found. Run cluster.py to create the clustering model."
            )

        if kmeans_model is None:
            raise ValueError("Clustering model not loaded.")
        adjusted_features = [
            base_features["danceability"] + danceability_contrast,
            base_features["energy"] + energy_contrast,
            base_features["loudness"] + loudness_contrast,
        ]
        cluster = kmeans_model.predict([adjusted_features])[0]
        return int(cluster)

    @staticmethod
    def get_recommendations(
        base_song_id: int,
        danceability_contrast: float = 0.0,
        energy_contrast: float = 0.0,
        loudness_contrast: float = 0.0,
        start_year: int = 0,
        end_year: int = 10000,
        tempo_range: int = 5,
        limit: int = 10,
    ) -> List[Song]:
        """
        Get recommended songs with:
        - Cluster assignment based on contrast parameters
            - If no contrast adjustments are provided, use the base song's stored cluster.
        - Compatible Camelot key
        - Tempo within ±5 BPM
        - Ordered by popularity
        """
        base_song = Song.query.get(base_song_id)
        if not base_song or not base_song.camelot_key_id:
            return []

        # Determine cluster:
        if (
            danceability_contrast == 0.0
            and energy_contrast == 0.0
            and loudness_contrast == 0.0
        ):
            # Use the stored cluster if available
            cluster = base_song.cluster
            if cluster is None:
                raise ValueError(
                    "Base song has no cluster assigned. Run clustering first."
                )
        else:
            base_features = {
                "danceability": base_song.danceability,
                "energy": base_song.energy,
                "loudness": base_song.loudness,
            }
            cluster = SongService.get_cluster_for_input(
                base_features, danceability_contrast, energy_contrast, loudness_contrast
            )

        # Get compatible key IDs
        compatible_keys = CamelotKeysService.get_compatible_keys(
            base_song.camelot_key_id
        )
        compatible_key_ids = [key.id for key in compatible_keys]

        return (
            Song.query.filter(
                Song.cluster == cluster,
                Song.camelot_key_id.in_(compatible_key_ids),
                Song.tempo.between(
                    base_song.tempo - tempo_range, base_song.tempo + tempo_range
                ),
                Song.year.between(start_year, end_year),
                Song.song_id != base_song_id,
            )
            .order_by(Song.popularity.desc())
            .limit(limit)
            .all()
        )

    # @staticmethod
    # We may not need this function...
    # def create_song(**kwargs) -> Song:
    #     song = Song(**kwargs)
    #     db.session.add(song)
    #     db.session.commit()
    #     return song

