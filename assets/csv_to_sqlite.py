import csv
import sqlite3
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import os

CSV_FILE = os.path.join(os.path.dirname(__file__), "ClassicHit.csv")
PROCESSED_CSV_FILE = os.path.join(os.path.dirname(__file__), "Processed_ClassicHit.csv")
DB_FILE = os.path.join(os.path.dirname(__file__), "ClassicHit.db")

''' 
Function to normalize features ['Danceability', 'Energy', 'Loudness',
'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence'] 
to values between 0 and 1.
Returns a new DataFrame that contains the same feature columns as the original, but 
replaces the values of the above features with normalized values.
'''
def normalize_features(df):
    features = ['Danceability', 'Energy', 'Loudness','Speechiness', 'Acousticness', 
            'Instrumentalness', 'Liveness', 'Valence']
    scaler = MinMaxScaler()
    df2 = df.copy()
    df2['Loudness_dB'] = df['Loudness'] # Keep the original Loudness column, which is in dB, but rename it
    df2[features] = scaler.fit_transform(df[features])

    return df2

'''
Function to add a new column 'Camelot_Key' to the DataFrame based on the 'Key' and 'Mode' columns.
The Camelot key is a system used by DJs to mix tracks harmonically. They are typically represented as
numbers from 1 to 12, with a letter indicating the mode (A for minor, B for major).
This mapping uses the values 1-12 for the minor keys and 13-24 for the major keys, while still maintaining 
relative order.
Ex: Camelot Key 1A is represented as 1; Camelot Key 1B is represented as 13. Camelot Key 2A is represented as 2;
Camelot Key 2B is represented as 14, etc.
Returns the DataFrame with the new 'Camelot_Key' column.
'''
def add_camelot_key(df):
    # Mapping of musical keys to Camelot keys based on mode (minor/major)
    musical_key_to_camelot = {
        # Major keys (Mode = 1)
        0: 20,      # 8B ~ C
        1: 15,      # 3B ~ C# / Db
        2: 22,      # 10B ~ D
        3: 17,      # 5B ~ D# / Eb
        4: 24,      # 12B ~ E
        5: 19,      # 7B ~ F
        6: 14,      # 2B ~ F# / Gb
        7: 21,      # 9B ~ G
        8: 16,      # 4B ~ G# / Ab
        9: 23,      # 11B ~ A
        10: 18,     # 6B ~ A# / Bb
        11: 13,     # 1B ~ B

        # Minor keys (Mode = 0)
        12: 5,      # 5A ~ C
        13: 12,     # 12A ~ C# / Db
        14: 7,      # 7A ~ D
        15: 2,      # 2A ~ D# / Eb
        16: 9,      # 9A ~ E
        17: 4,      # 4A ~ F
        18: 11,     # 11A ~ F# / Gb
        19: 6,      # 6A ~ G
        20: 1,      # 1A ~ G# / Ab
        21: 8,      # 8A ~ A
        22: 3,      # 3A ~ A# / Bb
        23: 10,     # 10A ~ B
    }
    
    # Map KeyMode to Camelot keys
    df['Camelot_Key'] = (df['Key'] + (df['Mode'] * 12)).map(musical_key_to_camelot)
    
    return df

def create_database(df):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # Drop the existing table (if it exists)
    c.execute("DROP TABLE IF EXISTS music_data")

    table_query = """
        CREATE TABLE music_data (
        SongID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title VARCHAR(255),
        Artist VARCHAR(255),
        Year INT, -- Year of release (assuming integer year)
        Duration INT, -- Duration of the track in milliseconds
        Time_Signature INT,
        `Key` INT, -- Musical key as integer (e.g., 0 = C, 1 = C#, etc.)
        Mode INT, -- Mode: 0 = Minor, 1 = Major
        Camelot_Key INT, -- Camelot key as integer
        Tempo FLOAT,
        Danceability FLOAT,
        Energy FLOAT,
        Loudness FLOAT, -- Normalized Loudness
        Loudness_dB FLOAT, -- Original Loudness in dB
        Speechiness FLOAT,
        Acousticness FLOAT,
        Instrumentalness FLOAT,
        Liveness FLOAT,
        Valence FLOAT,
        Popularity INT,
        Genre VARCHAR(255)
    );
    """

    c.execute(table_query)

    for _, row in df.iterrows():
        c.execute(
            """
            INSERT INTO music_data (Title, Artist, Year, Duration, Time_Signature, `Key`, Mode, Camelot_Key, Tempo, Danceability, Energy, Loudness, 
            Loudness_dB, Speechiness, Acousticness, Instrumentalness, Liveness, Valence, Popularity, Genre)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                row["Track"], # renamed to Title
                row["Artist"],
                row["Year"],
                row["Duration"],
                row["Time_Signature"],
                row["Key"],
                row["Mode"],
                row["Camelot_Key"],
                row["Tempo"],
                row["Danceability"],
                row["Energy"],
                row["Loudness"],
                row["Loudness_dB"],
                row["Speechiness"],
                row["Acousticness"],
                row["Instrumentalness"],
                row["Liveness"],
                row["Valence"],
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
    df2 = add_camelot_key(df) # Add the Camelot Key column
    df_normal = normalize_features(df2) # Normalize the features
    
    # Reorder DataFrame columns to match the INSERT statement
    df_normal = df_normal[['Track', 'Artist', 'Year', 'Duration', 'Time_Signature', 'Key', 'Mode', 'Camelot_Key', 
                           'Tempo', 'Danceability', 'Energy', 'Loudness', 'Loudness_dB', 'Speechiness', 
                           'Acousticness', 'Instrumentalness', 'Liveness', 'Valence', 'Popularity', 'Genre']]
    df_normal.to_csv(os.path.join(PROCESSED_CSV_FILE), index=False)
    create_database(df_normal) # Create the database and insert the data

    print_first_rows()

if __name__ == "__main__":
    main()
