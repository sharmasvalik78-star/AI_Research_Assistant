import sqlite3

db = "./chroma_db/chroma.sqlite3"

conn = sqlite3.connect(db)

rows = conn.execute(
    "SELECT dir, version, filename FROM migrations ORDER BY dir, version"
).fetchall()

print("Migration records:")
for row in rows:
    print(row)

conn.close()
