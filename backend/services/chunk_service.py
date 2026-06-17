def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []

    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i+chunk_size])

    return chunks
