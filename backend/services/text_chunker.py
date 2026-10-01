from typing import List


class TextChunker:
    """
    Production-ready text chunking service.
    """

    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 500,
        overlap: int = 100,
    ) -> List[str]:

        if not text:
            return []

        chunks = []

        start = 0

        while start < len(text):

            end = start + chunk_size

            chunk = text[start:end]

            chunks.append(chunk.strip())

            start += chunk_size - overlap

        return chunks