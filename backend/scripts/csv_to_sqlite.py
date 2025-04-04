# import csv
# import sqlite3

# CSV_FILE = "../ClassicHit.csv"
# DB_FILE = "../../db.db"

# all_rows = []
# with open(CSV_FILE, "r") as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         all_rows.append(row)


# def create_database():
#     conn = sqlite3.connect(DB_FILE)
#     c = conn.cursor()

#     table_query = """
#         CREATE TABLE IF NOT EXISTS music_data (
#         SongID INTEGER PRIMARY KEY AUTOINCREMENT,
#         Title VARCHAR(255),
#         Artist VARCHAR(255),
#         Year INT, -- Year of release (assuming integer year)
#         Duration INT, -- Duration of the track in milliseconds
#         Time_Signature INT,
#         Danceability FLOAT,
#         Energy FLOAT,
#         `Key` INT, -- Musical key as integer (e.g., 0 = C, 1 = C#, etc.)
#         Loudness FLOAT,
#         Mode INT, -- Mode: 0 = Minor, 1 = Major
#         Speechiness FLOAT,
#         Acousticness FLOAT,
#         Instrumentalness FLOAT,
#         Liveness FLOAT,
#         Valence FLOAT,
#         Tempo FLOAT,
#         Popularity INT,
#         Genre VARCHAR(255)
#     );
#     """

#     c.execute(table_query)

#     for row in all_rows:
#         c.execute(
#             """
#             INSERT INTO music_data (Title, Artist, Year, Duration, Time_Signature, Danceability, Energy, `Key`, Loudness, Mode, Speechiness, Acousticness, Instrumentalness, Liveness, Valence, Tempo, Popularity, Genre)
#             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
#             """,
#             (
#                 row["Track"], # renamed to Title
#                 row["Artist"],
#                 row["Year"],
#                 row["Duration"],
#                 row["Time_Signature"],
#                 row["Danceability"],
#                 row["Energy"],
#                 row["Key"],
#                 row["Loudness"],
#                 row["Mode"],
#                 row["Speechiness"],
#                 row["Acousticness"],
#                 row["Instrumentalness"],
#                 row["Liveness"],
#                 row["Valence"],
#                 row["Tempo"],
#                 row["Popularity"],
#                 row["Genre"],
#             ),
#         )
#     conn.commit()


# def print_first_rows(n: int=5):
#     conn = sqlite3.connect(DB_FILE)
#     c = conn.cursor()
#     c.execute("SELECT * FROM music_data LIMIT ?", (n,))
#     rows = c.fetchall()
#     for row in rows:
#         print(row)

# def main():
#     create_database()
#     print_first_rows()

# if __name__ == "__main__":
#     main()
