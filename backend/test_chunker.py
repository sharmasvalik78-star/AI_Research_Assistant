from services.document_parser import DocumentParser
from services.text_chunker import TextChunker


text = DocumentParser.parse(
    "uploads/5d090fcc-ac57-4874-bc49-1477315ec036.docx"
)

chunks = TextChunker.chunk_text(text)

print(f"Total Chunks: {len(chunks)}")

print("\n")

print(chunks[0])