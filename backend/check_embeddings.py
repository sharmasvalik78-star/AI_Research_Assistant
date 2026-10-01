import sqlite3

db = "./chroma_db/chroma.sqlite3"

conn = sqlite3.connect(db)

row = conn.execute("SELECT COUNT(*) FROM embeddings").fetchone()

print("Embedding count:", row[0])

conn.close()
