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
    def get_recommendations(base_song_id: int, 
                            start_year: int=0, end_year: int=10000, 
                            tempo_range: int=5,
                            limit: int=10) -> List[Song]:
        """
        Get recommended songs with:
        - Compatible Camelot key
        - Tempo within ±5 BPM
        - Ordered by popularity
        """
        base_song = Song.query.get(base_song_id)
        if not base_song or not base_song.camelot_key_id:
            return []

        # Get compatible key IDs
        compatible_keys = CamelotKeysService.get_compatible_keys(base_song.camelot_key_id)
        compatible_key_ids = [key.id for key in compatible_keys]

        return Song.query.filter(
            Song.camelot_key_id.in_(compatible_key_ids),
            Song.tempo.between(base_song.tempo - tempo_range, base_song.tempo + tempo_range),
            Song.year.between(start_year, end_year),
            Song.song_id != base_song_id
        ).order_by(
            Song.popularity.desc()
        ).limit(limit).all()

    # @staticmethod
    # We may not need this function...
    # def create_song(**kwargs) -> Song:
    #     song = Song(**kwargs)
    #     db.session.add(song)
    #     db.session.commit()
    #     return song