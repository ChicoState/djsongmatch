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
        base_song_id: int,
        danceability: float,
        energy: float,
        loudness: float,
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
        
        base_song = Song.query.get(base_song_id)

        adjusted_features = [
            danceability,
            energy,
            loudness,
            base_song.speechiness,
            base_song.acousticness,
            base_song.instrumentalness,
            base_song.liveness,
            base_song.valence
        ]
        cluster = kmeans_model.predict([adjusted_features])[0]
        return int(cluster)

    @staticmethod
    def get_recommendations(
        base_song_id: int,
        danceability: float,
        energy: float,
        loudness: float,
        start_year: int = 0,
        end_year: int = 10000,
        tempo_range: int = 20,
        limit: int = 100,
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
            danceability == base_song.danceability
            and energy == base_song.energy
            and loudness == base_song.loudness
        ):
            # Use the stored cluster if available
            cluster = base_song.cluster
            if cluster is None:
                raise ValueError(
                    "Base song has no cluster assigned. Run clustering first."
                )
        else:
            cluster = SongService.get_cluster_for_input(
                base_song_id, danceability, energy, loudness
            )

        print(f"Cluster: {cluster}")


        # Get compatible key IDs
        compatible_keys = CamelotKeysService.get_compatible_keys(
            base_song.camelot_key_id
        )
        compatible_key_ids = [key.id for key in compatible_keys]
        print(f"compatible_key_ids: {compatible_key_ids}")
        print(f"base song tempo: {base_song.tempo}, tempo range: {tempo_range}, low: {base_song.tempo - tempo_range}, high: {base_song.tempo + tempo_range}")

        return (
            Song.query.filter(
                Song.cluster == cluster,
                Song.camelot_key_id.in_(compatible_key_ids),
                Song.tempo.between(
                    0,200
                ),
                Song.tempo.between(
                    (base_song.tempo - tempo_range), (base_song.tempo + tempo_range)
                ),
                Song.year.between(start_year, end_year),
                Song.song_id != base_song_id,
            )
            .order_by(Song.popularity.desc())
            # .limit(limit)
            .all()
        )

        return (
            Song.query.filter(
                Song.cluster == cluster,
                Song.camelot_key_id.in_(compatible_key_ids),
                # Song.tempo.between(
                #     base_song.tempo - tempo_range, base_song.tempo + tempo_range
                # ),
                # Song.year.between(start_year, end_year),
                # Song.song_id != base_song_id,
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

