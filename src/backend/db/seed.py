from pathlib import Path
import pandas as pd
from sqlalchemy.orm import Session
from db.database import insert_songs, insert_camelot_keys, init_db, get_db
from db.models import Song, CamelotKey

PROJECT_ROOT = Path(__file__).parent.parent.parent # src
PROCESSED_CSV_PATH = PROJECT_ROOT / "db" / "Processed_ClassicHit.csv"

def seed_from_csv(csv_path: str, db: Session):
    '''
    Seeds database db with data from a .csv file containing pre-processed song and camelot key info.
    '''
    df = pd.read_csv(csv_path)

    # Process CamelotKeys
    camelot_keys = [
        CamelotKey(
            id=row['Camelot_Key'],
            key=row['Key'],
            mode=row['Mode'],
            key_str=row['Key_String']
        )
        for _, row in df[['Camelot_Key', 'Key', 'Mode', 'Key_String']]
            .drop_duplicates().iterrows()
    ]
    insert_camelot_keys(db, camelot_keys)

    # Process Songs
    songs = [
        Song(
            song_id=row['Song_ID'],
            title=row['Track'],
            artist=row['Artist'],
            year=row['Year'],
            duration=row['Duration'],
            time_signature=row['Time_Signature'],
            camelot_key_id=row['Camelot_Key'],
            tempo=row['Tempo'],
            danceability=row['Danceability'],
            energy=row['Energy'],
            loudness=row['Loudness'],
            loudness_dB=row['Loudness_dB'],
            speechiness=row['Speechiness'],
            acousticness=row['Acousticness'],
            instrumentalness=row['Instrumentalness'],
            liveness=row['Liveness'],
            valence=row['Valence'],
            popularity=row['Popularity'],
            genre=row['Genre']
        )
        for _, row in df.drop_duplicates().iterrows()
    ]
    insert_songs(db, songs)

if __name__ == "__main__":
    init_db() # Clears old db to start fresh
    with next(get_db()) as db:  # Get a session
        seed_from_csv(PROCESSED_CSV_PATH, db)