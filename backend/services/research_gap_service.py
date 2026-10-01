from services.gemini_service import gemini_service
from core.config import GEMINI_MODEL


class ResearchGapService:
    """
    Detects research gaps from uploaded research documents.
    """

    @staticmethod
    def detect_gaps(context: str) -> str:
        prompt = f"""
# ROLE

You are an AI Research Assistant specialized in
research gap detection.

Analyze ONLY the provided document context.

Identify research gaps, unanswered questions,
limitations, unexplored areas, and potential future
research directions that are explicitly supported
or reasonably indicated by the documents.

# RULES

- Use ONLY information from the provided documents.
- Do NOT invent facts, findings, limitations, or research areas.
- Clearly distinguish documented limitations from potential gaps.
- Do not assume that something is a research gap merely because
  it is not mentioned.
- If the documents do not provide enough information for a gap,
  say so.
- Keep each gap concise but informative.
- Clearly identify the source document when possible.
- Use GitHub Flavored Markdown.

# RESPONSE FORMAT

## Research Gaps

| # | Research Gap | Evidence / Explanation | Source |
|---|--------------|-----------------------|--------|
| 1 | ... | ... | ... |

## Unanswered Research Questions

- Question 1
- Question 2

## Documented Limitations

- Limitation 1
- Limitation 2

## Potential Future Research Directions

1. Direction 1
2. Direction 2

## Overall Gap Analysis

Provide a concise summary of the major research gaps
identified from the provided documents.

If a section has no supported information, write:

"No information available in the provided documents."

# DOCUMENT CONTEXT

{context}
"""

        response = gemini_service.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text.strip()


research_gap_service = ResearchGapService()