import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from pathlib import Path

BACKEND_ROOT = Path(__file__).parent.parent
CSV_INPUT = BACKEND_ROOT / "assets" / "ClassicHit.csv"
CSV_OUTPUT = BACKEND_ROOT / "assets" / "Processed_ClassicHit.csv"


''' 
Function to normalize features ['Danceability', 'Energy', 'Loudness',
'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence'] 
to values between 0 and 1.
Returns a new DataFrame that contains the same feature columns as the original, but 
replaces the values of the above features with normalized values.
'''
def normalize_features(df):
    features = ['Danceability', 'Energy', 'Loudness', 'Speechiness', 'Acousticness', 
            'Instrumentalness', 'Liveness', 'Valence']
    
    scaler = MinMaxScaler()
    
    df['Loudness_dB'] = df['Loudness'] # Keep the original Loudness column, which is in dB, but rename it
    df[features] = scaler.fit_transform(df[features]) # Normalize the selected features

    return df

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
    # key : value mappings
    #   for major (musical) keys:
    #       (musical) key : camelot key id
    #   for minor (musical) keys:
    #       (musical) key + 12 : camelot key id
    # Note: musical keys start at C being represented by 0, C# being represented by 1, etc.
    musical_key_to_camelot = {
        # Major keys (Mode = 1)
        0: 20,      # C :       8B
        1: 15,      # C# / Db : 3B
        2: 22,      # D :       10B
        3: 17,      # D# / Eb : 5B
        4: 24,      # E :       12B
        5: 19,      # F :       7B
        6: 14,      # F# / Gb : 2B
        7: 21,      # G :       9B
        8: 16,      # G# / Ab : 4B
        9: 23,      # A :       11B
        10: 18,     # A# / Bb : 6B
        11: 13,     # B :       1B

        # Minor keys (Mode = 0)
        12: 5,      # C :       5A
        13: 12,     # C# / Db : 12A
        14: 7,      # D :       7A
        15: 2,      # D# / Eb : 2A
        16: 9,      # E :       9A
        17: 4,      # F :       4A
        18: 11,     # F# / Gb : 11A
        19: 6,      # G :       6A
        20: 1,      # G# / Ab : 1A
        21: 8,      # A :       8A
        22: 3,      # A# / Bb : 3A
        23: 10,     # B :       10A
    }
    
    # Map Key-Mode to Camelot keys
    df['Camelot_Key'] = (df['Key'] + (abs(df['Mode']-1) * 12)).map(musical_key_to_camelot)
    
    return df

def add_key_string(df):
    
    key_map = {
        0: 'C',
        1: 'C#/Db',
        2: 'D',
        3: 'D#/Eb',
        4: 'E',
        5: 'F',
        6: 'F#/Gb',
        7: 'G',
        8: 'G#/Ab',
        9: 'A',
        10: 'A#/Bb',
        11: 'B'
    }

    mode_map = {
        0: 'min',
        1: 'Maj'
    }

    # Apply the mappings to the Key and Mode columns to create the Key_String column
    df['Key_String'] = df['Key'].map(key_map) + " " + df['Mode'].map(mode_map)

    return df

def main():
    # Read the CSV file
    df = pd.read_csv(CSV_INPUT)

    # Normalize the features
    df = normalize_features(df)

    # Add the Camelot key
    df = add_camelot_key(df)

    # Add the Key_String column
    df = add_key_string(df)

    # Add Song_ID column
    df = df.reset_index().rename(columns={'index': 'Song_ID'})

    # Reorder DataFrame columns
    df = df[['Song_ID', 'Track', 'Artist', 'Year', 'Duration', 'Time_Signature', 'Key', 'Mode', 
             'Key_String', 'Camelot_Key', 'Tempo', 'Danceability', 'Energy', 'Loudness', 
             'Loudness_dB', 'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence', 
             'Popularity', 'Genre']]
    
    # print(df[['Song_ID', 'Track', 'Artist', 'Time_Signature', 'Key', 'Mode', 
    #          'Key_String', 'Camelot_Key', 'Loudness', 'Loudness_dB']][df['Mode']==1].head())
    # print(df[['Song_ID', 'Track', 'Artist', 'Time_Signature', 'Key', 'Mode', 
    #          'Key_String', 'Camelot_Key', 'Loudness', 'Loudness_dB']][df['Mode']==0].head())

    # Save the processed DataFrame to a new CSV file
    df.to_csv(CSV_OUTPUT, index=False)

if __name__ == "__main__":
    main()