from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)


class GeminiService:
    """
    Gemini AI Service
    """

    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError(
                "GEMINI_API_KEY not found in .env"
            )

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

        print("Gemini API Key Loaded:", GEMINI_API_KEY[:10] + "...")
        print("Gemini Model:", GEMINI_MODEL)

    def generate_rag_answer(
        self,
        context: str,
        question: str,
    ) -> str:

        prompt = f"""
# ROLE

You are an AI Research Assistant.

Use ONLY the provided document context to answer.

If the answer is not present in the document context, reply exactly:

"I couldn't find the answer in the uploaded documents."

# RESPONSE FORMAT

Always respond using GitHub Flavored Markdown.

When appropriate:

- Use headings (#, ##, ###)
- Use bullet lists
- Use numbered lists
- Use tables
- Use **bold** for important terms
- Use *italic* for emphasis
- Use code blocks when appropriate.
- Keep the response well structured and easy to read.

Do not invent information that is not present in the document context.

---

## DOCUMENT CONTEXT

{context}

---

## QUESTION

{question}
"""

        response = self.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text.strip()

    def generate_general_answer(
        self,
        question: str,
    ) -> str:

        prompt = f"""
# ROLE

You are an AI Research Assistant.

Answer the user's question using your general knowledge.

Always respond using GitHub Flavored Markdown.

When appropriate:

- Use headings
- Use bullet lists
- Use numbered lists
- Use tables
- Use **bold**
- Use *italic*
- Use fenced code blocks with language names
- Keep the answer well structured.

## QUESTION

{question}
"""

        response = self.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text.strip()


gemini_service = GeminiService()