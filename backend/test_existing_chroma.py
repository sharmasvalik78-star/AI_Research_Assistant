import chromadb

CHROMA_PATH = "./chroma_db"

print("Opening Chroma database...")

client = chromadb.PersistentClient(path=CHROMA_PATH)

print("Getting existing collection...")

collection = client.get_collection(name="documents")

print("SUCCESS")
print("Collection:", collection.name)
print("Count:", collection.count())
