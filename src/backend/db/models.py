from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Float, ForeignKey, UniqueConstraint
from typing import List
from api.extensions import db

class Song(db.Model):
    '''Class to define the 'songs' table in the database.'''
    
    __tablename__ = 'songs'
    __table_args__ = (
        UniqueConstraint('song_id', name='uq_song_id'),
    )
    
    song_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    artist: Mapped[str] = mapped_column(String(255))
    year: Mapped[int] = mapped_column(Integer)
    duration: Mapped[int] = mapped_column(Integer)
    time_signature: Mapped[int] = mapped_column(Integer)
    camelot_key_id: Mapped[int] = mapped_column(Integer, ForeignKey('camelot_keys.id'))
    tempo: Mapped[float] = mapped_column(Float)
    danceability: Mapped[float] = mapped_column(Float)
    energy: Mapped[float] = mapped_column(Float)
    loudness: Mapped[float] = mapped_column(Float)
    loudness_dB: Mapped[float] = mapped_column(Float)
    speechiness: Mapped[float] = mapped_column(Float)
    acousticness: Mapped[float] = mapped_column(Float)
    instrumentalness: Mapped[float] = mapped_column(Float)
    liveness: Mapped[float] = mapped_column(Float)
    valence: Mapped[float] = mapped_column(Float)
    popularity: Mapped[int] = mapped_column(Integer)
    genre: Mapped[str] = mapped_column(String(30))
    camelot_key: Mapped["CamelotKey"] = relationship(back_populates="songs")

    def __repr__(self):
        return f"<Song(id={self.song_id}, title={self.title}, artist={self.artist}, year={self.year})>"

class CamelotKey(db.Model):
    '''Class to define the 'camelot_keys' table in the database.'''
    
    __tablename__ = 'camelot_keys'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[int] = mapped_column(Integer)
    mode:  Mapped[int] = mapped_column(Integer)
    key_str: Mapped[str] = mapped_column(String(10))
    
    songs: Mapped[List["Song"]] = relationship(back_populates="camelot_key")

    def __repr__(self):
        return f"<Camelot_Key(id={self.id}, key={self.key}, mode={self.mode}, key_str={self.key_str})>"

