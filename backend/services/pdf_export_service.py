from io import BytesIO

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)

from schemas.research_report import (
    ResearchReportResponse,
)


def generate_research_report_pdf(
    report: ResearchReportResponse,
) -> bytes:
    """
    Generates a PDF from an existing research report.

    The report object must already be created by
    build_research_report().

    This service is responsible ONLY for rendering
    the PDF.
    """

    buffer = BytesIO()

    document = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    # -------------------------------------------------
    # Title
    # -------------------------------------------------

    story.append(
        Paragraph(
            "AI Research Report",
            styles["Title"],
        )
    )

    story.append(Spacer(1, 18))

    # -------------------------------------------------
    # Project
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Project Information",
            styles["Heading1"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Name:</b> {report.project.name}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Description:</b> {report.project.description or '-'}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Created:</b> {report.project.created_at}",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Executive Summary
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Executive Summary",
            styles["Heading1"],
        )
    )

    story.append(
        Paragraph(
            report.ai_summary.executive_summary,
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Research Summary
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Research Summary",
            styles["Heading1"],
        )
    )

    story.append(
        Paragraph(
            report.ai_summary.research_summary,
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Productivity Insights
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Productivity Insights",
            styles["Heading1"],
        )
    )

    story.append(
        Paragraph(
            report.ai_summary.productivity_insights,
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Analytics
    # -------------------------------------------------

    analytics = report.analytics

    story.append(
        Paragraph(
            "Analytics",
            styles["Heading1"],
        )
    )

    story.append(
        Paragraph(
            f"Projects: {analytics.total_projects}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Documents: {analytics.total_documents}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Chat Sessions: {analytics.total_chat_sessions}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Messages: {analytics.total_messages}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"Research Notes: {analytics.total_research_notes}",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Documents
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Documents",
            styles["Heading1"],
        )
    )

    for document_item in report.documents:
        story.append(
            Paragraph(
                f"• {document_item.filename}",
                styles["BodyText"],
            )
        )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Chat Sessions
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Chat Sessions",
            styles["Heading1"],
        )
    )

    for session in report.chat_sessions:
        story.append(
            Paragraph(
                f"• {session.title} ({session.message_count} messages)",
                styles["BodyText"],
            )
        )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Research Notes
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Research Notes",
            styles["Heading1"],
        )
    )

    for note in report.research_notes:
        story.append(
            Paragraph(
                f"• {note.title}",
                styles["BodyText"],
            )
        )

    story.append(Spacer(1, 16))

    # -------------------------------------------------
    # Citations
    # -------------------------------------------------

    story.append(
        Paragraph(
            "Citations",
            styles["Heading1"],
        )
    )

    for citation in report.citations:
        story.append(
            Paragraph(
                f"• {citation.filename} (Chunk {citation.chunk})",
                styles["BodyText"],
            )
        )

    document.build(story)

    pdf = buffer.getvalue()

    buffer.close()

    return pdf