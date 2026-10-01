import json

from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)


client = genai.Client(
    api_key=GEMINI_API_KEY,
)

MODEL = GEMINI_MODEL


class PresentationService:
    """
    Generates structured presentation slides
    from research document context.
    """

    @staticmethod
    def generate_slides(context: str) -> dict:
        prompt = f"""
# ROLE

You are an AI Research Assistant specialized in
academic research presentation generation.

Analyze ONLY the provided research document context.

Create a concise academic presentation outline
suitable for presenting the research to an audience.

# RULES

- Use ONLY information present in the documents.
- Do NOT invent facts, results, statistics, authors, or dates.
- Keep the presentation focused on the actual research content.
- Create 6 to 10 slides.
- Keep each slide concise.
- Use short bullet points.
- Include the source document name when appropriate.
- Return ONLY valid JSON.
- Do not use Markdown fences.
- Do not include explanations outside the JSON.

# JSON FORMAT

{{
  "title": "Presentation title",
  "slides": [
    {{
      "slide_number": 1,
      "title": "Slide title",
      "bullets": [
        "Bullet point 1",
        "Bullet point 2",
        "Bullet point 3"
      ]
    }}
  ]
}}

# SUGGESTED STRUCTURE

1. Title / Research Overview
2. Background / Problem
3. Objectives
4. Methodology
5. System / Approach
6. Key Findings
7. Limitations / Research Gaps
8. Future Research Directions
9. Conclusion

Only include sections supported by the documents.

# DOCUMENT CONTEXT

{context}
"""

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "", 1)

        if text.startswith("```"):
            text = text.replace("```", "", 1)

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        data = json.loads(text)

        return {
            "title": data.get(
                "title",
                "Research Presentation",
            ),
            "slides": data.get(
                "slides",
                [],
            ),
        }


presentation_service = PresentationService()