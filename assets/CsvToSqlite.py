import pandas as pd
import sqlite3
import os

PROCESSED_CSV_FILE = os.path.join(os.path.dirname(__file__), "Processed_ClassicHit.csv")
DB_FILE = os.path.join(os.path.dirname(__file__), "ClassicHit.db")

def create_database(df):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    # Drop the existing table (if it exists)
    c.execute("DROP TABLE IF EXISTS music_data")

    table_query = """
        CREATE TABLE music_data (
        Song_ID INTEGER PRIMARY KEY,
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
            INSERT INTO music_data (Song_ID, Title, Artist, Year, Duration, Time_Signature, `Key`, Mode, Camelot_Key, Tempo, Danceability, Energy, Loudness, 
            Loudness_dB, Speechiness, Acousticness, Instrumentalness, Liveness, Valence, Popularity, Genre)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                row["Song_ID"],
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
    df = pd.read_csv(PROCESSED_CSV_FILE)
    create_database(df) # Create the database and insert the data
    print_first_rows()

if __name__ == "__main__":
    main()
