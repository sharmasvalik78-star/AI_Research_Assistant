from schemas.research_report import (
    ResearchReportResponse,
)


def generate_research_report_markdown(
    report: ResearchReportResponse,
) -> bytes:
    """
    Generates a Markdown (.md) research report
    from an existing ResearchReportResponse.

    This service only formats the report.
    """

    lines = []

    # -------------------------------------------------
    # Title
    # -------------------------------------------------

    lines.append("# AI Research Report")
    lines.append("")

    # -------------------------------------------------
    # Project Information
    # -------------------------------------------------

    lines.append("## Project Information")
    lines.append("")
    lines.append(f"**Name:** {report.project.name}")
    lines.append("")
    lines.append(
        f"**Description:** {report.project.description or '-'}"
    )
    lines.append("")
    lines.append(
        f"**Created:** {report.project.created_at}"
    )
    lines.append("")

    # -------------------------------------------------
    # Executive Summary
    # -------------------------------------------------

    lines.append("## Executive Summary")
    lines.append("")
    lines.append(report.ai_summary.executive_summary)
    lines.append("")

    # -------------------------------------------------
    # Research Summary
    # -------------------------------------------------

    lines.append("## Research Summary")
    lines.append("")
    lines.append(report.ai_summary.research_summary)
    lines.append("")

    # -------------------------------------------------
    # Productivity Insights
    # -------------------------------------------------

    lines.append("## Productivity Insights")
    lines.append("")
    lines.append(report.ai_summary.productivity_insights)
    lines.append("")

    # -------------------------------------------------
    # Analytics
    # -------------------------------------------------

    analytics = report.analytics

    lines.append("## Analytics")
    lines.append("")
    lines.append(f"- Projects: {analytics.total_projects}")
    lines.append(f"- Documents: {analytics.total_documents}")
    lines.append(f"- Chat Sessions: {analytics.total_chat_sessions}")
    lines.append(f"- Messages: {analytics.total_messages}")
    lines.append(f"- Research Notes: {analytics.total_research_notes}")
    lines.append("")

    # -------------------------------------------------
    # Documents
    # -------------------------------------------------

    lines.append("## Documents")
    lines.append("")

    for document in report.documents:
        lines.append(f"- {document.filename}")

    lines.append("")

    # -------------------------------------------------
    # Chat Sessions
    # -------------------------------------------------

    lines.append("## Chat Sessions")
    lines.append("")

    for session in report.chat_sessions:
        lines.append(
            f"- {session.title} ({session.message_count} messages)"
        )

    lines.append("")

    # -------------------------------------------------
    # Research Notes
    # -------------------------------------------------

    lines.append("## Research Notes")
    lines.append("")

    for note in report.research_notes:
        lines.append(f"- {note.title}")

    lines.append("")

    # -------------------------------------------------
    # Citations
    # -------------------------------------------------

    lines.append("## Citations")
    lines.append("")

    for citation in report.citations:
        lines.append(
            f"- {citation.filename} (Chunk {citation.chunk})"
        )

    lines.append("")

    markdown = "\n".join(lines)

    return markdown.encode("utf-8")