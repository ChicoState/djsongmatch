import sqlalchemy
from database import DEFAULT_DATABASE_URL
from models import Song


def print_songs():
    """Debug function to print 10 songs in the database
    (Makes sure data is there)
    """
    engine = sqlalchemy.create_engine(DEFAULT_DATABASE_URL)
    session = sqlalchemy.orm.sessionmaker(bind=engine)()
    songs = session.query(Song).limit(10)
    for song in songs:
        print(song)


if __name__ == "__main__":
    print_songs()
