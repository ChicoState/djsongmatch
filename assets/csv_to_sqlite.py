import csv
import sqlite3
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import os

CSV_FILE = os.path.join(os.path.dirname(__file__), "ClassicHit.csv")
CSV_NORMALIZED_FILE = os.path.join(os.path.dirname(__file__), "normalized_ClassicHit.csv")
DB_FILE = os.path.join(os.path.dirname(__file__), "ClassicHit.db")

''' 
Function to normalize features ['Danceability', 'Energy', 'Loudness',
'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence'] 
to values between 0 and 1.
Returns a new DataFrame that contains the same feature columns as the original, but 
replaces the values of the above features with normalized values.
'''
def normalize_features(df, save_to_csv=False):
    features = ['Danceability', 'Energy', 'Loudness','Speechiness', 'Acousticness', 
            'Instrumentalness', 'Liveness', 'Valence']
    scaler = MinMaxScaler()
    df2 = df.copy()
    df2['Loudness_dB'] = df['Loudness'] # Keep the original Loudness column, which is in dB, but rename it
    df2[features] = scaler.fit_transform(df[features])

    if save_to_csv:
        df2.to_csv(os.path.join(CSV_NORMALIZED_FILE), index=False)

    return df2

def create_database(df):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # Drop the existing table (if it exists)
    c.execute("DROP TABLE IF EXISTS music_data")

    table_query = """
        CREATE TABLE IF NOT EXISTS music_data (
        SongID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title VARCHAR(255),
        Artist VARCHAR(255),
        Year INT, -- Year of release (assuming integer year)
        Duration INT, -- Duration of the track in milliseconds
        Time_Signature INT,
        Danceability FLOAT,
        Energy FLOAT,
        `Key` INT, -- Musical key as integer (e.g., 0 = C, 1 = C#, etc.)
        Loudness FLOAT, -- Normalized Loudness
        Loudness_dB FLOAT, -- Original Loudness in dB
        Mode INT, -- Mode: 0 = Minor, 1 = Major
        Speechiness FLOAT,
        Acousticness FLOAT,
        Instrumentalness FLOAT,
        Liveness FLOAT,
        Valence FLOAT,
        Tempo FLOAT,
        Popularity INT,
        Genre VARCHAR(255)
    );
    """

    c.execute(table_query)

    for _, row in df.iterrows():
        c.execute(
            """
            INSERT INTO music_data (Title, Artist, Year, Duration, Time_Signature, Danceability, Energy, `Key`, Loudness, 
            Loudness_dB, Mode, Speechiness, Acousticness, Instrumentalness, Liveness, Valence, Tempo, Popularity, Genre)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                row["Track"], # renamed to Title
                row["Artist"],
                row["Year"],
                row["Duration"],
                row["Time_Signature"],
                row["Danceability"],
                row["Energy"],
                row["Key"],
                row["Loudness"],
                row["Loudness_dB"],
                row["Mode"],
                row["Speechiness"],
                row["Acousticness"],
                row["Instrumentalness"],
                row["Liveness"],
                row["Valence"],
                row["Tempo"],
                row["Popularity"],
                row["Genre"],
            ),
        )
    conn.commit()
    conn.close()


def print_first_rows(n: int=5):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT * FROM music_data LIMIT ?", (n,))
    rows = c.fetchall()
    for row in rows:
        print(row)
    conn.close()

def main():
    df = pd.read_csv(CSV_FILE)
    df_normal = normalize_features(df, save_to_csv=True) # Normalize the features
    create_database(df_normal) # Create the database and insert the data
    print_first_rows()

if __name__ == "__main__":
    main()
