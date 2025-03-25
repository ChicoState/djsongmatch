import pathlib

import sqlalchemy
from models import Base, Camelot_Key, Song

DEFAULT_DATABASE_FILEPATH = pathlib.Path(__file__).parents[1] / "db.db"

DEFAULT_DATABASE_URL = f"sqlite://{DEFAULT_DATABASE_FILEPATH}"


def init_db(database_url: str = DEFAULT_DATABASE_URL):
    """
    - Drops all existing data and creates new tables.
    - WARNING: This will delete all data in the database.
    - Should only be called when first setting up the database.
    """

    engine = sqlalchemy.create_engine(database_url, echo=True)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)


def insert_camelot_key(
    camelot_key: list[Camelot_Key], database_url: str = DEFAULT_DATABASE_URL
):
    """
    Inserts a list of Camelot_Key's into the database.
    """
    engine = sqlalchemy.create_engine(database_url, echo=True)
    session = sqlalchemy.orm.sessionmaker(bind=engine)()
    session.add_all(camelot_key)
    session.commit()
    session.close()


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
