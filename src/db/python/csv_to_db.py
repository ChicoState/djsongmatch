import pathlib
import sys

import pandas as pd
import sqlalchemy
from database import DEFAULT_DATABASE_URL, init_db
from models import Song
from sklearn.preprocessing import MinMaxScaler

CSV_FILE = pathlib.Path(__file__).parent / "ClassicHit.csv"
PROCESSED_CSV_FILE = pathlib.Path(__file__).parent / "Processed_ClassicHit.csv"


def normalize_features(df, features: list[str]):
    """
    Function to normalize a list of dataframe columns to values between 0 and 1.
    Returns a new DataFrame that contains the same feature columns as the original, but
    replaces the values of the above features with normalized values.
    """
    scaler = MinMaxScaler()
    df[features] = scaler.fit_transform(df[features])  # Normalize the selected features

    return df


def add_camelot_key(df):
    """
    Function to add a new column 'Camelot_Key' to the DataFrame based on the 'Key' and 'Mode' columns.
    The Camelot key is a system used by DJs to mix tracks harmonically. They are typically represented as
    numbers from 1 to 12, with a letter indicating the mode (A for minor, B for major).
    This mapping uses the values 1-12 for the minor keys and 13-24 for the major keys, while still maintaining
    relative order.
    Ex: Camelot Key 1A is represented as 1; Camelot Key 1B is represented as 13. Camelot Key 2A is represented as 2;
    Camelot Key 2B is represented as 14, etc.
    Returns the DataFrame with the new 'Camelot_Key' column.
    """
    # Mapping of musical keys to Camelot keys based on mode (minor/major)
    musical_key_to_camelot = {
        # Major keys (Mode = 1)
        0: 20,  # C :       8B
        1: 15,  # C# / Db : 3B
        2: 22,  # D :       10B
        3: 17,  # D# / Eb : 5B
        4: 24,  # E :       12B
        5: 19,  # F :       7B
        6: 14,  # F# / Gb : 2B
        7: 21,  # G :       9B
        8: 16,  # G# / Ab : 4B
        9: 23,  # A :       11B
        10: 18,  # A# / Bb : 6B
        11: 13,  # B :       1B
        # Minor keys (Mode = 0)
        12: 5,  # C :       5A
        13: 12,  # C# / Db : 12A
        14: 7,  # D :       7A
        15: 2,  # D# / Eb : 2A
        16: 9,  # E :       9A
        17: 4,  # F :       4A
        18: 11,  # F# / Gb : 11A
        19: 6,  # G :       6A
        20: 1,  # G# / Ab : 1A
        21: 8,  # A :       8A
        22: 3,  # A# / Bb : 3A
        23: 10,  # B :       10A
    }

    # Map Key-Mode to Camelot keys
    df["Camelot_Key"] = (df["Key"] + (abs(df["Mode"] - 1) * 12)).map(
        musical_key_to_camelot
    )

    return df


def main():
    # Read the CSV file
    df = pd.read_csv(CSV_FILE)

    # Clone the original Loudness column, which is in dB, but rename it
    # (we'll normalize the original Loudness column later)
    df["Loudness_dB"] = df["Loudness"]

    # List of dataframe columns to normalize
    features_to_normalize = [
        "Danceability",
        "Energy",
        "Loudness",
        "Speechiness",
        "Acousticness",
        "Instrumentalness",
        "Liveness",
        "Valence",
    ]

    # Normalize the features
    df = normalize_features(df, features_to_normalize)

    # Add the Camelot key
    df = add_camelot_key(df)

    # Add Song_ID column
    df = df.reset_index().rename(columns={"index": "Song_ID"})

    # Reorder DataFrame columns
    df = df[
        [
            "Song_ID",
            "Track",
            "Artist",
            "Year",
            "Duration",
            "Time_Signature",
            "Key",
            "Mode",
            "Camelot_Key",
            "Tempo",
            "Danceability",
            "Energy",
            "Loudness",
            "Loudness_dB",
            "Speechiness",
            "Acousticness",
            "Instrumentalness",
            "Liveness",
            "Valence",
            "Popularity",
            "Genre",
        ]
    ]

    df.to_csv(PROCESSED_CSV_FILE, index=False)

    # Rename df columns to match the column names in the Song model
    df = df.rename(columns={"Track": "title"})
    df = df.drop(columns=["Key", "Mode"])
    df = df.rename(columns={col: col.lower() for col in df.columns})

    init_db()
    engine = sqlalchemy.create_engine(DEFAULT_DATABASE_URL, echo=True)

    df.to_sql("song", engine, if_exists="append", index=False)


if __name__ == "__main__":
    main()
