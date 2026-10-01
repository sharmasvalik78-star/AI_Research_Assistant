import sqlite3

db = "./chroma_db/chroma.sqlite3"

conn = sqlite3.connect(db)

rows = conn.execute("PRAGMA table_info(migrations)").fetchall()

print("Migrations columns:")
for row in rows:
    print(row)

conn.close()
