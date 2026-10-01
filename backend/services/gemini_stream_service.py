from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)


class GeminiStreamService:
    """
    Gemini Streaming Service
    """

    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError(
                "GEMINI_API_KEY not found in .env"
            )

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

    def stream_answer(
        self,
        question: str,
        context: str,
    ):
        """
        Stream answer from Gemini
        """

        prompt = f"""
You are an AI Research Assistant.

Use ONLY the context below.

If the answer cannot be found in the context,
say you don't know.

Context:
{context}

Question:
{question}

Answer:
"""

        stream = self.client.models.generate_content_stream(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        for chunk in stream:
            if (
                hasattr(chunk, "text")
                and chunk.text
            ):
                yield chunk.text


gemini_stream_service = GeminiStreamService()