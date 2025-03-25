from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Song(Base):
    __tablename__ = "song"
    song_id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    artist: Mapped[str] = mapped_column(String(255))
    year: Mapped[int] = mapped_column(Integer)
    camelot_key: Mapped[int] = mapped_column(ForeignKey("camelot_key.id"))
    duration: Mapped[int] = mapped_column(Integer)
    time_signature: Mapped[int] = mapped_column(Integer)
    danceability: Mapped[float] = mapped_column(Float)
    energy: Mapped[float] = mapped_column(Float)
    loudness: Mapped[float] = mapped_column(Float)
    loudness_db: Mapped[float] = mapped_column(Float)
    speechiness: Mapped[float] = mapped_column(Float)
    acousticness: Mapped[float] = mapped_column(Float)
    instrumentalness: Mapped[float] = mapped_column(Float)
    liveness: Mapped[float] = mapped_column(Float)
    valence: Mapped[float] = mapped_column(Float)
    tempo: Mapped[float] = mapped_column(Float)
    popularity: Mapped[int] = mapped_column(Integer)
    genre: Mapped[str] = mapped_column(String(64))

    def __repr__(self):
        return f"<Song(id={self.song_id}, title={self.title}, artist={self.artist}, year={self.year})>"


class Camelot_Key(Base):
    __tablename__ = "camelot_key"
    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[int] = mapped_column(Integer)
    mode: Mapped[int] = mapped_column(Integer)
    key_str: Mapped[str] = mapped_column(String(32))

    def __repr__(self):
        return f"<Camelot_Key(id={self.id}, key={self.key}, mode={self.mode}, key_str={self.key_str})>"
