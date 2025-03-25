import pandas as pd
from sqlalchemy.orm import Session
from database import engine
from models import Song, CamelotKey

'''
Function to seed database with data from a .csv file containing 
pre-processed song info and camelot key info.
'''
def seed_from_csv(csv_path: str):
    df = pd.read_csv(csv_path)
    
    with Session(engine) as session:
        
        # Process CamelotKeys
        camelot_data = df[['Camelot_Key', 'Key', 'Mode', 'Key_String']].drop_duplicates()
        
        for _, row in camelot_data.iterrows():
            if not session.get(CamelotKey, row['Camelot_Key']):
                camelot_key = CamelotKey(
                    id=row['Camelot_Key'],
                    key=row['Key'],
                    mode=row['Mode'],
                    key_str=row['Key_String']
                )
                session.add(camelot_key)
        
        session.commit()
        
        # Process Songs
        for _, row in df.iterrows():
            song = Song(
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
            session.add(song)
        
        session.commit()

if __name__ == "__main__":
    seed_from_csv("Processed_ClassicHit.csv")