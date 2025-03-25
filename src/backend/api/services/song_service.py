from typing import List
from db.models import Song
from api.extensions import db

def get_songs() -> List[Song]:
    return db.session.execute(db.select(Song)).scalars().all()

def get_song_by_id(song_id: int) -> Song:
    return db.session.get(Song, song_id)

def create_song(**kwargs) -> Song:
    song = Song(**kwargs)
    db.session.add(song)
    db.session.commit()
    return song