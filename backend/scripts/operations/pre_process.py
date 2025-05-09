"""
Data Preprocessing Operations

Transforms raw song data into a normalized format ready for database seeding and model training.
This module handles:
    - Feature normalization via quantile scaling
    - Musical key mappings to Camelot wheel notation
    - Human-readable key notation

This module is primarily used by the manage_data.py CLI, but the core
functions can also be imported and used programmatically.

Usage:
    # From manage_data.py
    from backend.scripts.operations.pre_process import process_data
    process_data(input_path='input.csv', output_path='output.csv')
"""

import pandas as pd
import logging
from typing import Optional
from pathlib import Path

# Import project constants
from backend.constants import (
    AUDIO_FEATURES, 
    RAW_CSV_PATH,
    PROCESSED_CSV_PATH
)

# Configure logging
logger = logging.getLogger(__name__)

# Convert lowercase feature names to title case for CSV columns
FEATURES = [feature.capitalize() for feature in AUDIO_FEATURES]

def uniform_quantile_scale(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Transforms numerical features to have a uniform distribution in the range [0, 1] using rank-based quantile scaling.

    This function applies a percentile rank followed by quantile binning to each feature in the FEATURES list.
    The transformation ensures that each feature is scaled to a uniform distribution, helping mitigate the effects
    of skewness and outliers. This is particularly useful for clustering and models sensitive to feature scaling.

    If a feature has too few unique values to be quantile-binned into 100 bins, it falls back to percentile ranking.

    Args:
        df (pd.DataFrame): A DataFrame containing the original features.
    Returns:
        pd.DataFrame: A new DataFrame with the specified features transformed into a uniform [0, 1] distribution.
    '''
    df_rank_q = df.copy()

    for feature in FEATURES:
        try:
            df_rank_q[feature] = pd.qcut(df_rank_q[feature].rank(method='first'), q=100, labels=False) / 99
        except ValueError:
            df_rank_q[feature] = df_rank_q[feature].rank(pct=True)

    return df_rank_q


def add_camelot_key(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Function to add a new column 'Camelot_Key' to the DataFrame based on the 'Key' and 'Mode' columns.
    The Camelot key is a system used by DJs to mix tracks harmonically. They are typically represented as
    numbers from 1 to 12, with a letter indicating the mode (A for minor, B for major).
    This mapping uses the values 1-12 for the minor keys and 13-24 for the major keys, while still maintaining 
    relative order.
    Ex: Camelot Key 1A is represented as 1; Camelot Key 1B is represented as 13. Camelot Key 2A is represented as 2;
    Camelot Key 2B is represented as 14, etc.

    Args:
        df (pd.DataFrame): DataFrame containing 'Key' and 'Mode' columns.
    Returns:
        pd.DataFrame: DataFrame with the new 'Camelot_Key' column.
    '''
    
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

def add_key_string(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Adds a human-readable key notation column (e.g., "C Maj", "A min").

    Creates a 'Key_String' column by mapping numeric key and mode values to 
    their standard music notation. This makes the dataset more readable for
    musicians and DJs.

    Args:
        df (pd.DataFrame): DataFrame with 'Key' and 'Mode' columns
    Returns:
        pd.DataFrame: DataFrame with added 'Key_String' column
    '''
    
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

def process_data(input_path: Optional[str] = None, output_path: Optional[str] = None) -> pd.DataFrame:
    """
    Process raw CSV data into a normalized format suitable for database loading and model training.
    
    Args:
        input_path: Path to input CSV file (uses default from constants if None)
        output_path: Path to output processed CSV file (uses default from constants if None)
    Returns:
        The processed DataFrame
    """
    # Use default paths if not specified
    if input_path is None:
        input_path = RAW_CSV_PATH
    if output_path is None:
        output_path = PROCESSED_CSV_PATH
        
    logger.info(f"Processing data from {input_path}")
    
    # Read the CSV file
    df = pd.read_csv(input_path)
    logger.info(f"Loaded {len(df)} songs from CSV")

    # Keep the original Loudness column, which is in dB, but rename it
    df['Loudness_dB'] = df['Loudness']

    # Apply quantile scale transformation
    logger.info("Applying uniform quantile scaling to audio features")
    df = uniform_quantile_scale(df)

    # Add the Camelot key
    logger.info("Adding Camelot wheel key notation")
    df = add_camelot_key(df)

    # Add the Key_String column
    logger.info("Adding human-readable key notation")
    df = add_key_string(df)

    # Add Song_ID column
    df = df.reset_index().rename(columns={'index': 'Song_ID'})

    # Reorder DataFrame columns
    df = df[['Song_ID', 'Track', 'Artist', 'Year', 'Duration', 'Time_Signature', 'Key', 'Mode', 
             'Key_String', 'Camelot_Key', 'Tempo', 'Danceability', 'Energy', 'Loudness', 
             'Loudness_dB', 'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence', 
             'Popularity', 'Genre']]
    
    # Save the processed DataFrame to CSV
    df.to_csv(output_path, index=False)
    logger.info(f"Processed data saved to {output_path} ({len(df)} songs)")
    
    return df