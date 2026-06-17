import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(
    path="chroma_db"
)

embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

collection = client.get_or_create_collection(
    name="documents",
    embedding_function=embedding_function
)

def chunk_text(
    text,
    chunk_size=1000
):
    chunks = []

    for i in range(
        0,
        len(text),
        chunk_size
    ):
        chunks.append(
            text[i:i+chunk_size]
        )

    return chunks

def add_document(
    text,
    doc_id
):
    chunks = chunk_text(text)

    ids = [
        f"{doc_id}_{i}"
        for i in range(len(chunks))
    ]

    collection.add(
        documents=chunks,
        ids=ids
    )

def search_document(
    query
):
    results = collection.query(
        query_texts=[query],
        n_results=3
    )

    return results["documents"][0]
