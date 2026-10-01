from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database.session import get_db

from models.user import User

from schemas.research_report import ResearchReportResponse

from services.research_report_service import build_research_report

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from services.research_report_share_service import (
    get_share_by_token,
    increment_access_count,
    is_share_valid,
)

router = APIRouter(
    prefix="/public/research-reports",
    tags=["Public Research Reports"],
)


@router.get(
    "/{share_token}",
    response_model=ResearchReportResponse,
)
def get_public_research_report(
    share_token: str,
    db: Session = Depends(get_db),
):
    """
    Returns a publicly shared research report.
    """

    share = get_share_by_token(
        db=db,
        token=share_token,
    )

    if share is None:
        raise HTTPException(
            status_code=404,
            detail="Share not found.",
        )

    if not share.is_public:
        raise HTTPException(
            status_code=403,
            detail="This research report is not publicly available.",
        )

    if not is_share_valid(share):
        raise HTTPException(
            status_code=410,
            detail="Share link has expired.",
        )
    
    owner = (
        db.query(User)
        .filter(User.id == share.user_id)
        .first()
    )

    if owner is None:
        raise HTTPException(
            status_code=404,
            detail="Report owner not found.",
        )

    increment_access_count(
        db=db,
        share=share,
    )

    report = build_research_report(
        db=db,
        user=owner,
        project_id=share.project_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Research report not found.",
        )

    report.allow_download = share.allow_download

    return report

@router.get(
    "/{share_token}/download",
)
def download_public_research_report(
    share_token: str,
    db: Session = Depends(get_db),
):
    """
    Downloads a publicly shared research report as a PDF.
    """

    share = get_share_by_token(
        db=db,
        token=share_token,
    )

    if share is None:
        raise HTTPException(
            status_code=404,
            detail="Share not found.",
        )

    if not share.is_public:
        raise HTTPException(
            status_code=403,
            detail="This research report is not publicly available.",
        )

    if not is_share_valid(share):
        raise HTTPException(
            status_code=410,
            detail="Share link has expired.",
        )

    if not share.allow_download:
        raise HTTPException(
            status_code=403,
            detail="Downloading is disabled for this share link.",
        )

    owner = (
        db.query(User)
        .filter(User.id == share.user_id)
        .first()
    )

    if owner is None:
        raise HTTPException(
            status_code=404,
            detail="Report owner not found.",
        )

    report = build_research_report(
        db=db,
        user=owner,
        project_id=share.project_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Research report not found.",
        )

    buffer = BytesIO()

    pdf = canvas.Canvas(
        buffer,
        pagesize=A4,
    )

    width, height = A4

    left_margin = 50
    right_margin = 50
    top_margin = 50
    bottom_margin = 50

    y = height - top_margin

    def draw_line(text="", font="Helvetica", size=10, gap=14):
        nonlocal y

        if y < bottom_margin:
            pdf.showPage()
            y = height - top_margin

        pdf.setFont(font, size)
        pdf.drawString(left_margin, y, str(text))
        y -= gap

    def draw_wrapped(text, font="Helvetica", size=10, width_chars=95):
        import textwrap

        lines = textwrap.wrap(
            str(text),
            width=width_chars,
            break_long_words=False,
            break_on_hyphens=False,
        )

        if not lines:
            lines = [""]

        for line in lines:
            draw_line(
                line,
                font=font,
                size=size,
                gap=14,
            )

    def get_value(obj, key, default=None):
        if isinstance(obj, dict):
            return obj.get(key, default)

        return getattr(obj, key, default)

    project = get_value(report, "project", {}) or {}
    ai_summary = get_value(report, "ai_summary", {}) or {}
    analytics = get_value(report, "analytics", {}) or {}

    project_name = get_value(
        project,
        "name",
        "Research Report",
    )

    project_description = get_value(
        project,
        "description",
        "No project description available.",
    )

    created_at = get_value(
        project,
        "created_at",
        None,
    )

    draw_line(
        "AI Research Assistant Pro",
        font="Helvetica-Bold",
        size=18,
        gap=24,
    )

    draw_line(
        "Shared Research Report",
        font="Helvetica-Bold",
        size=16,
        gap=22,
    )

    draw_line(
        project_name,
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    draw_wrapped(
        project_description,
        size=10,
    )

    if created_at:
        draw_line(
            f"Created: {created_at}",
            size=9,
            gap=20,
        )

    draw_line(
        "AI Research Summary",
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    draw_line(
        "Executive Summary",
        font="Helvetica-Bold",
        size=11,
    )

    draw_wrapped(
        get_value(
            ai_summary,
            "executive_summary",
            "No executive summary available.",
        ),
    )

    draw_line(
        "Research Summary",
        font="Helvetica-Bold",
        size=11,
        gap=14,
    )

    draw_wrapped(
        get_value(
            ai_summary,
            "research_summary",
            "No research summary available.",
        ),
    )

    draw_line(
        "Productivity Insights",
        font="Helvetica-Bold",
        size=11,
        gap=14,
    )

    draw_wrapped(
        get_value(
            ai_summary,
            "productivity_insights",
            "No productivity insights available.",
        ),
    )

    draw_line(
        "Research Analytics",
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    draw_line(
        f"Projects: {get_value(analytics, 'total_projects', 0)}",
    )

    draw_line(
        f"Documents: {get_value(analytics, 'total_documents', 0)}",
    )

    draw_line(
        f"Chat Sessions: {get_value(analytics, 'total_chat_sessions', 0)}",
    )

    draw_line(
        f"Messages: {get_value(analytics, 'total_messages', 0)}",
    )

    draw_line(
        f"Research Notes: {get_value(analytics, 'total_research_notes', 0)}",
        gap=20,
    )

    documents = get_value(
        report,
        "documents",
        [],
    ) or []

    draw_line(
        "Documents",
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    if documents:
        for document in documents:
            filename = get_value(
                document,
                "filename",
                "Unnamed document",
            )

            uploaded_at = get_value(
                document,
                "uploaded_at",
                None,
            )

            draw_wrapped(
                f"- {filename}"
                + (
                    f" | Uploaded: {uploaded_at}"
                    if uploaded_at
                    else ""
                ),
            )
    else:
        draw_line("No documents available.")

    chat_sessions = get_value(
        report,
        "chat_sessions",
        [],
    ) or []

    draw_line(
        "Chat Sessions",
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    if chat_sessions:
        for chat in chat_sessions:
            title = get_value(
                chat,
                "title",
                "Untitled Chat",
            )

            message_count = get_value(
                chat,
                "message_count",
                0,
            )

            draw_wrapped(
                f"- {title} | Messages: {message_count}",
            )
    else:
        draw_line("No chat sessions available.")

    research_notes = get_value(
        report,
        "research_notes",
        [],
    ) or []

    draw_line(
        "Research Notes",
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    if research_notes:
        for note in research_notes:
            title = get_value(
                note,
                "title",
                "Untitled Note",
            )

            tags = get_value(
                note,
                "tags",
                [],
            ) or []

            favorite = get_value(
                note,
                "is_favorite",
                False,
            )

            note_text = f"- {title}"

            if tags:
                note_text += f" | Tags: {', '.join(map(str, tags))}"

            if favorite:
                note_text += " | Favorite: Yes"

            draw_wrapped(note_text)
    else:
        draw_line("No research notes available.")

    citations = get_value(
        report,
        "citations",
        [],
    ) or []

    draw_line(
        "Citations",
        font="Helvetica-Bold",
        size=14,
        gap=20,
    )

    if citations:
        unique_citations = {}

        for citation in citations:
            filename = get_value(
                citation,
                "filename",
                "Unknown source",
            )

            chunk = get_value(
                citation,
                "chunk",
                0,
            )

            key = f"{filename}-{chunk}"

            unique_citations[key] = citation

        for citation in unique_citations.values():
            filename = get_value(
                citation,
                "filename",
                "Unknown source",
            )

            chunk = get_value(
                citation,
                "chunk",
                0,
            )

            draw_wrapped(
                f"- {filename} | Chunk {chunk}",
            )
    else:
        draw_line("No citations available.")

    pdf.save()

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                'attachment; filename="research-report.pdf"'
            )
        },
    )