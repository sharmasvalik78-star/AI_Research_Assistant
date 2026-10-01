from services.gemini_service import gemini_service


class ResearchTimelineService:
    """
    Generates a chronological research timeline
    from uploaded research documents.
    """

    @staticmethod
    def generate_timeline(context: str) -> str:

        prompt = f"""
# ROLE

You are an AI Research Assistant specialized in research timeline generation.

Analyze ONLY the provided document context.

Create a chronological timeline of the important research events,
developments, milestones, methods, findings, or stages mentioned
in the documents.

# RULES

- Use ONLY information from the provided context.
- Do NOT invent dates, events, researchers, findings, or milestones.
- If an exact date is available, use it.
- If only a year is available, use the year.
- If no date is available, place the item under "Date Not Specified".
- Arrange dated events from oldest to newest.
- Clearly distinguish information from different documents.
- Keep each timeline entry concise but informative.
- Use GitHub Flavored Markdown.

# RESPONSE FORMAT

## Research Timeline

| Date | Event / Development | Source |
|------|---------------------|--------|
| ... | ... | ... |

## Key Research Progress

- Summarize the major progression or development visible in the timeline.
- Mention important changes in methods, findings, or research direction.
- Do not add information that is not present in the documents.

## Date Not Specified

List important events where the documents do not provide
a specific date.

# DOCUMENT CONTEXT

{context}
"""

        response = gemini_service.client.models.generate_content(
            model=gemini_service.client and __import__(
                "core.config",
                fromlist=["GEMINI_MODEL"]
            ).GEMINI_MODEL,
            contents=prompt,
        )

        return response.text.strip()


research_timeline_service = ResearchTimelineService()