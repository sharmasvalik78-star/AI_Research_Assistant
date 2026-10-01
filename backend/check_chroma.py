import sqlite3

db = "./chroma_db/chroma.sqlite3"

conn = sqlite3.connect(db)
tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").fetchall()

print(tables)

conn.close()
