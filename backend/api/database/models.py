from typing import List, Optional
from sqlalchemy.orm import Mapped
from sqlalchemy import Integer, String, Float, ForeignKey, UniqueConstraint
from backend.api.extensions import db

class Song(db.Model):
    '''Class to define the 'songs' table in the database.'''
    
    __tablename__ = 'songs'
    __table_args__ = (
        UniqueConstraint('song_id', name='uq_song_id'),
    )
    
    # Columns
    song_id: Mapped[int] = db.Column(Integer, primary_key=True, nullable=False)
    title: Mapped[str] = db.Column(String(255), nullable=False)
    artist: Mapped[str] = db.Column(String(255), nullable=False)
    year: Mapped[int] = db.Column(Integer, nullable=False)
    duration: Mapped[int] = db.Column(Integer, nullable=False)
    time_signature: Mapped[int] = db.Column(Integer, nullable=False)
    camelot_key_id: Mapped[int] = db.Column(Integer, ForeignKey('camelot_keys.id'), nullable=False)
    tempo: Mapped[float] = db.Column(Float, nullable=False)
    danceability: Mapped[float] = db.Column(Float, nullable=False)
    energy: Mapped[float] = db.Column(Float, nullable=False)
    loudness: Mapped[float] = db.Column(Float, nullable=False)
    loudness_dB: Mapped[float] = db.Column(Float, nullable=False)
    speechiness: Mapped[float] = db.Column(Float, nullable=False)
    acousticness: Mapped[float] = db.Column(Float, nullable=False)
    instrumentalness: Mapped[float] = db.Column(Float, nullable=False)
    liveness: Mapped[float] = db.Column(Float, nullable=False)
    valence: Mapped[float] = db.Column(Float, nullable=False)
    popularity: Mapped[int] = db.Column(Integer, nullable=False)
    genre: Mapped[Optional[str]] = db.Column(String(30), nullable=False)
    cluster: Mapped[Optional[int]] = db.Column(db.Integer, nullable=True)
    
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