import sqlite3
import sys

from datatypes import Song_Key
from key_bpm_detection import get_bpm_from_path, get_key_from_path

DEFAULT_DB_PATH = "djsongmatch.db"


def add_to_db(db_path, song_path, key: Song_Key, bpm: float):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute(
        "CREATE TABLE IF NOT EXISTS SongInfo (song_path VARCHAR(50) PRIMARY KEY, key VARCHAR(9), bpm FLOAT)"
    )
    c.execute(
        "REPLACE INTO SongInfo VALUES (?, ?, ?)",
        (song_path, key.value, bpm),
    )
    conn.commit()
    conn.close()


def print_db(db_path):
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT * FROM SongInfo")
    for row in c:
        print(row)
    conn.close()


def main():
    if len(sys.argv) <= 1:
        print(f"Usage: {sys.argv[0]}  <path to song file> [path to db file]")
        return

    if len(sys.argv) == 3:
        db_path = sys.argv[2]
    else:
        db_path = DEFAULT_DB_PATH

    song_key = get_key_from_path(sys.argv[1])
    song_bpm = get_bpm_from_path(sys.argv[1])
    add_to_db(db_path, sys.argv[1], song_key, song_bpm)
    print_db(db_path)


if __name__ == "__main__":
    main()
