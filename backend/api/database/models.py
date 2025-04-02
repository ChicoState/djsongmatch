from typing import List, Optional
from sqlalchemy.orm import Mapped, relationship
from api.extensions import db
from sqlalchemy import Integer, String, Float, ForeignKey, UniqueConstraint

class Song(db.Model):
    '''Class to define the 'songs' table in the database.'''
    
    __tablename__ = 'songs'
    __table_args__ = (
        UniqueConstraint('song_id', name='uq_song_id'),
    )
    
    # Columns
    song_id: Mapped[int] = db.Column(Integer, primary_key=True)
    title: Mapped[str] = db.Column(String(255))
    artist: Mapped[str] = db.Column(String(255))
    year: Mapped[int] = db.Column(Integer)
    duration: Mapped[int] = db.Column(Integer)
    time_signature: Mapped[int] = db.Column(Integer)
    camelot_key_id: Mapped[int] = db.Column(Integer, ForeignKey('camelot_keys.id'))
    tempo: Mapped[float] = db.Column(Float)
    danceability: Mapped[float] = db.Column(Float)
    energy: Mapped[float] = db.Column(Float)
    loudness: Mapped[float] = db.Column(Float)
    loudness_dB: Mapped[float] = db.Column(Float)
    speechiness: Mapped[float] = db.Column(Float)
    acousticness: Mapped[float] = db.Column(Float)
    instrumentalness: Mapped[float] = db.Column(Float)
    liveness: Mapped[float] = db.Column(Float)
    valence: Mapped[float] = db.Column(Float)
    popularity: Mapped[int] = db.Column(Integer)
    genre: Mapped[Optional[str]] = db.Column(String(30))  # Nullable
    
    # Relationships
    camelot_key: Mapped["CamelotKey"] = db.relationship(back_populates="songs")

    def __repr__(self):
        return f"<Song(id={self.song_id}, title={self.title}, artist={self.artist}, year={self.year})>"

class CamelotKey(db.Model):
    '''Class to define the 'camelot_keys' table in the database.'''
    
    __tablename__ = 'camelot_keys'
    
    # Columns
    id: Mapped[int] = db.Column(Integer, primary_key=True)
    key: Mapped[int] = db.Column(Integer)
    mode: Mapped[int] = db.Column(Integer)
    key_str: Mapped[str] = db.Column(String(10))
    
    # Relationships
    songs: Mapped[List["Song"]] = db.relationship(back_populates="camelot_key")

    def __repr__(self):
        return f"<Camelot_Key(id={self.id}, key={self.key}, mode={self.mode}, key_str={self.key_str})>"