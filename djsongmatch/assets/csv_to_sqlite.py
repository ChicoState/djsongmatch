import csv
import sqlite3

CSV_FILE = "ClassicHit.csv"
DB_FILE = "ClassicHit.db"

all_rows = []
with open(CSV_FILE, "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        all_rows.append(row)

print(all_rows)
