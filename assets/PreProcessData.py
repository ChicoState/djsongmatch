import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import os

CSV_FILE = os.path.join(os.path.dirname(__file__), "ClassicHit.csv")
PROCESSED_CSV_FILE = os.path.join(os.path.dirname(__file__), "Processed_ClassicHit.csv")

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
    df['Camelot_Key'] = (df['Key'] + (df['Mode'] * 12)).map(musical_key_to_camelot)
    
    return df

def main():
    # Read the CSV file
    df = pd.read_csv(CSV_FILE)

    # Normalize the features
    df = normalize_features(df)

    # Add the Camelot key
    df = add_camelot_key(df)

    # Reorder DataFrame columns
    df = df[['Track', 'Artist', 'Year', 'Duration', 'Time_Signature', 'Key', 'Mode', 'Camelot_Key', 
             'Tempo', 'Danceability', 'Energy', 'Loudness', 'Loudness_dB', 'Speechiness', 
             'Acousticness', 'Instrumentalness', 'Liveness', 'Valence', 'Popularity', 'Genre']]

    # Save the processed DataFrame to a new CSV file
    df.to_csv(os.path.join(PROCESSED_CSV_FILE), index=False)

if __name__ == "__main__":
    main()