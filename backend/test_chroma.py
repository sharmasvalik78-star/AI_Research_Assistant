from services.chroma_service import chroma_service

chunks = [
    "Artificial Intelligence is transforming healthcare.",
    "Machine Learning is a subset of AI.",
    "Deep Learning uses neural networks.",
]

chroma_service.add_document_chunks(
    document_id=1,
    chunks=chunks,
)

print("Chunks inserted successfully!")

results = chroma_service.search(
    "What is Machine Learning?"
)

print(results)