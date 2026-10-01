import json

from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)

from schemas.research_report import (
    ReportAISummary,
)


# =====================================================
# Gemini Client
# =====================================================

client = genai.Client(
    api_key=GEMINI_API_KEY,
)

MODEL = GEMINI_MODEL


# =====================================================
# Fallback Summary
# =====================================================

def _fallback_summary():
    """
    Returns an empty AI summary when Gemini is unavailable.
    """

    return ReportAISummary(
        executive_summary="AI summary is currently unavailable.",
        research_summary="",
        productivity_insights="",
    )


# =====================================================
# Prompt Builder
# =====================================================

def _build_prompt(
    project,
    analytics,
    documents,
    chat_sessions,
    research_notes,
):
    """
    Build the prompt sent to Gemini.
    """

    prompt = f"""
You are an expert research analyst.

Generate a professional research report.

Return ONLY valid JSON.

Required JSON format:

{{
    "executive_summary": "...",
    "research_summary": "...",
    "productivity_insights": "..."
}}

Project Information

Name:
{project.name}

Description:
{project.description}

Analytics

Projects:
{analytics.total_projects}

Documents:
{analytics.total_documents}

Chat Sessions:
{analytics.total_chat_sessions}

Messages:
{analytics.total_messages}

Research Notes:
{analytics.total_research_notes}

Documents:

"""

    for document in documents:
        prompt += f"- {document.filename}\n"

    prompt += "\nChat Sessions:\n"

    for session in chat_sessions:
        prompt += (
            f"- {session.title}"
            f" ({session.message_count} messages)\n"
        )

    prompt += "\nResearch Notes:\n"

    for note in research_notes:
        prompt += f"- {note.title}\n"

    prompt += """

Using the information above:

1. Write an executive summary.

2. Summarize the research.

3. Provide productivity insights.

Do not include markdown.

Return only JSON.
"""

    return prompt


# =====================================================
# Gemini Generation
# =====================================================

def generate_ai_summary(
    project,
    analytics,
    documents,
    chat_sessions,
    research_notes,
):
    """
    Generates an AI research report using Gemini.

    If Gemini is temporarily unavailable or the API quota
    is exceeded, return a fallback summary so the research
    report can still be generated.
    """

    try:
        prompt = _build_prompt(
            project=project,
            analytics=analytics,
            documents=documents,
            chat_sessions=chat_sessions,
            research_notes=research_notes,
        )

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

        try:
            data = json.loads(text)

        except Exception:
            return ReportAISummary(
                executive_summary=text,
                research_summary="",
                productivity_insights="",
            )

        return ReportAISummary(
            executive_summary=data.get(
                "executive_summary",
                "",
            ),
            research_summary=data.get(
                "research_summary",
                "",
            ),
            productivity_insights=data.get(
                "productivity_insights",
                "",
            ),
        )

    except Exception as error:
        print(
            "Gemini AI summary generation failed:",
            error,
        )

        return _fallback_summary()


# =====================================================
# Convenience Wrapper
# =====================================================

def generate_project_ai_summary(
    project,
    analytics,
    documents,
    chat_sessions,
    research_notes,
):
    """
    Convenience wrapper used by the research report service.
    """

    return generate_ai_summary(
        project=project,
        analytics=analytics,
        documents=documents,
        chat_sessions=chat_sessions,
        research_notes=research_notes,
    )