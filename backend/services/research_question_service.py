from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)


class ResearchQuestionService:
    """
    Generates research questions from uploaded
    research document context.
    """

    def __init__(self):
        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

    def generate_questions(
        self,
        context: str,
    ) -> str:

        prompt = f"""
# ROLE

You are an AI Research Assistant specialized in
academic research question generation.

Analyze ONLY the provided research document context.

Generate meaningful research questions based on
the topics, methods, findings, limitations,
and unanswered areas described in the documents.

# RULES

- Use ONLY information present in the documents.
- Do NOT invent research topics that are unrelated
  to the provided documents.
- Do NOT claim that a question is unanswered unless
  the documents support that interpretation.
- Clearly distinguish questions derived from the
  documents from potential future research questions.
- Keep questions specific and research-oriented.
- Avoid duplicate questions.
- Clearly identify the source document when possible.
- Use GitHub Flavored Markdown.

# RESPONSE FORMAT

## Research Questions

1. **Question:** ...
   - **Source:** ...

2. **Question:** ...
   - **Source:** ...

## Unanswered Questions

- Question 1
- Question 2

## Potential Future Research Questions

1. Question 1
2. Question 2
3. Question 3

## Research Question Summary

Provide a concise summary explaining the major
research themes represented by the generated questions.

If a section has no supported information, write:

"No information available in the provided documents."

# DOCUMENT CONTEXT

{context}
"""

        response = self.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text.strip()


research_question_service = ResearchQuestionService()