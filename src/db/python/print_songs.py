import sqlalchemy
from database import DEFAULT_DATABASE_URL
from models import Camelot_Key, Song


def print_songs():
    """Debug function to print 10 songs in the database
    (Makes sure data is there)
    """
    engine = sqlalchemy.create_engine(DEFAULT_DATABASE_URL)
    session = sqlalchemy.orm.sessionmaker(bind=engine)()
    songs = session.query(Song).limit(10)
    for song in songs:
        print(song)


def print_camelot_keys():
    """Debug function to print the camelot keys in the database
    (Makes sure data is there)
    """
    engine = sqlalchemy.create_engine(DEFAULT_DATABASE_URL)
    session = sqlalchemy.orm.sessionmaker(bind=engine)()
    camelot_keys = session.query(Camelot_Key).all()
    for camelot_key in camelot_keys:
        print(camelot_key)


if __name__ == "__main__":
    print("Printing songs")
    print_songs()

    print("\nPrinting camelot keys")
    print_camelot_keys()
