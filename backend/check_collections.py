import sqlite3

db = "./chroma_db/chroma.sqlite3"

conn = sqlite3.connect(db)

rows = conn.execute("SELECT id, name FROM collections").fetchall()

print("Collections:")
for row in rows:
    print(row)

conn.close()
