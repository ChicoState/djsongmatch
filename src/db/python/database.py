import pathlib

import sqlalchemy
from models import Base, Camelot_Key, Song

DEFAULT_DATABASE_FILEPATH = pathlib.Path(__file__).parents[1] / "db.db"

DEFAULT_DATABASE_URL = f"sqlite:///{DEFAULT_DATABASE_FILEPATH}"


def reset_db(database_url: str = DEFAULT_DATABASE_URL):
    """
    - Drops all existing data and creates new tables.
    - WARNING: This will delete all data in the database.
    - Should only be called when first setting up the database.
    """

    engine = sqlalchemy.create_engine(database_url, echo=True)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    init_camelot_keys()


def insert_song(song: list[Song], database_url: str = DEFAULT_DATABASE_URL):
    """
    Inserts a list of Song's into the database.
    """
    engine = sqlalchemy.create_engine(database_url, echo=True)
    Base.metadata.create_all(engine)
    session = sqlalchemy.orm.sessionmaker(bind=engine)()
    session.add_all(song)
    session.commit()
    session.close()


def init_camelot_keys():
    """Drops all existing data in Camelot_Key table and creates new records"""
    engine = sqlalchemy.create_engine(DEFAULT_DATABASE_URL, echo=True)

    # Ensure Camelot_Key table exists
    Base.metadata.create_all(engine)

    # Camelot_Keys to be inserted
    camelot_keys = [
        Camelot_Key(id=1, key=8, mode=0, key_str="Ab min"),
        Camelot_Key(id=2, key=3, mode=0, key_str="Eb min"),
        Camelot_Key(id=3, key=10, mode=0, key_str="Bb min"),
        Camelot_Key(id=4, key=5, mode=0, key_str="F min"),
        Camelot_Key(id=5, key=12, mode=0, key_str="C min"),
        Camelot_Key(id=6, key=7, mode=0, key_str="G min"),
        Camelot_Key(id=7, key=2, mode=0, key_str="D min"),
        Camelot_Key(id=8, key=9, mode=0, key_str="A min"),
        Camelot_Key(id=9, key=4, mode=0, key_str="E min"),
        Camelot_Key(id=10, key=11, mode=0, key_str="B min"),
        Camelot_Key(id=11, key=6, mode=0, key_str="F# min"),
        Camelot_Key(id=12, key=1, mode=0, key_str="C# min"),
        Camelot_Key(id=13, key=8, mode=1, key_str="B Maj"),
        Camelot_Key(id=14, key=3, mode=1, key_str="Gb Maj"),
        Camelot_Key(id=15, key=10, mode=1, key_str="Db Maj"),
        Camelot_Key(id=16, key=5, mode=1, key_str="Ab Maj"),
        Camelot_Key(id=17, key=12, mode=1, key_str="Eb Maj"),
        Camelot_Key(id=18, key=7, mode=1, key_str="Bb Maj"),
        Camelot_Key(id=19, key=2, mode=1, key_str="F Maj"),
        Camelot_Key(id=20, key=9, mode=1, key_str="C Maj"),
        Camelot_Key(id=21, key=4, mode=1, key_str="G Maj"),
        Camelot_Key(id=22, key=11, mode=1, key_str="D Maj"),
        Camelot_Key(id=23, key=6, mode=1, key_str="A Maj"),
        Camelot_Key(id=24, key=1, mode=1, key_str="E Maj"),
    ]

    # Insert Camelot_Keys
    session = sqlalchemy.orm.sessionmaker(bind=engine)()
    session.add_all(camelot_keys)
    session.commit()
    session.close()
