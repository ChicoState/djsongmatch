import pandas as pd
from pathlib import Path
from api import create_app
from api.database.operations import init_camelot_keys, insert_songs
from api.database.management import reset_db
from api.database.models import Song

PROJECT_ROOT = Path(__file__).parent.parent
PROCESSED_CSV_PATH = PROJECT_ROOT / "assets" / "Processed_ClassicHit.csv"

def seed_from_csv(csv_path: str):
    '''
    Seeds database with data from a .csv file containing pre-processed song and camelot key info.
    WARNING: Will clear old database and seed from scratch.
    '''
    app = create_app() # Create Flask app instance

    with app.app_context():  # Establish application context
        reset_db()

        # Initialize Camelot Keys
        init_camelot_keys()

        # Process Songs
        df = pd.read_csv(csv_path)
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
        insert_songs(songs)

if __name__ == "__main__":
    seed_from_csv(PROCESSED_CSV_PATH)