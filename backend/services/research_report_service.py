from sqlalchemy.orm import Session
from sqlalchemy import func

from models.project import Project
from models.document import Document
from models.chat_session import ChatSession
from models.research_note import ResearchNote
from models.message import Message

from models.user import User

from services.analytics_service import (
    get_analytics_overview,
)

from services.gemini_report_service import (
    generate_project_ai_summary,
)

from schemas.research_report import (
    ReportProject,
    ReportDocument,
    ReportChatSession,
    ReportResearchNote,
    ReportCitation,
    ReportAnalytics,
    ReportAISummary,
    ResearchReportResponse,
)


# =====================================================
# Internal Helpers
# =====================================================

def _get_project(
    db: Session,
    user: User,
    project_id: int,
):
    """
    Returns the project owned by the current user.
    """

    return (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == user.id,
        )
        .first()
    )


def _get_documents(
    db: Session,
    user: User,
    project_id: int,
):
    """
    Returns all project documents.
    """

    return (
        db.query(Document)
        .filter(
            Document.user_id == user.id,
            Document.project_id == project_id,
        )
        .order_by(Document.uploaded_at.asc())
        .all()
    )


def _get_chat_sessions(
    db: Session,
    user: User,
    project_id: int,
):
    """
    Returns all project chat sessions.
    """

    return (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == user.id,
            ChatSession.project_id == project_id,
        )
        .order_by(ChatSession.created_at.asc())
        .all()
    )


def _get_research_notes(
    db: Session,
    user: User,
    project_id: int,
):
    """
    Returns all research notes for a project.
    """

    return (
        db.query(ResearchNote)
        .join(
            ChatSession,
            ResearchNote.session_id == ChatSession.id,
        )
        .filter(
            ResearchNote.user_id == user.id,
            ChatSession.project_id == project_id,
        )
        .order_by(ResearchNote.created_at.asc())
        .all()
    )

# =====================================================
# Message Statistics
# =====================================================

def _message_count(
    db: Session,
    session_id: int,
):
    """
    Returns total messages in a chat session.
    """

    return (
        db.query(Message)
        .filter(
            Message.session_id == session_id,
        )
        .count()
    )


def _project_message_count(
    db: Session,
    project_id: int,
):
    """
    Returns total messages across the project.
    """

    return (
        db.query(func.count(Message.id))
        .join(
            ChatSession,
            Message.session_id == ChatSession.id,
        )
        .filter(
            ChatSession.project_id == project_id,
        )
        .scalar()
        or 0
    )

# =====================================================
# Citations
# =====================================================

def _collect_citations(
    db: Session,
    project_id: int,
):
    """
    Collect all citations used by assistant messages
    inside this project.
    """

    citations = []
    seen = set()

    messages = (
        db.query(Message)
        .join(
            ChatSession,
            Message.session_id == ChatSession.id,
        )
        .filter(
            ChatSession.project_id == project_id,
            Message.role == "assistant",
        )
        .all()
    )

    for message in messages:

        if not message.citations:
            continue

        for citation in message.citations:

            if not isinstance(citation, dict):
                continue

            chunk_value = citation.get("chunk", "")

            if isinstance(chunk_value, int):
                chunk_number = chunk_value

            elif (
                isinstance(chunk_value, str)
                and chunk_value.strip().isdigit()
            ):
                chunk_number = int(chunk_value)

            else:
                chunk_number = 0

            filename = citation.get(
                "filename",
                "Unknown",
            )

            key = (
                filename,
                chunk_number,
            )

            if key in seen:
                continue

            seen.add(key)

            citations.append(
                ReportCitation(
                    filename=filename,
                    chunk=chunk_number,
                    apa=f"{filename}. Chunk {chunk_number}.",
                    ieee=f"[{chunk_number}] {filename}, Chunk {chunk_number}.",
                    mla=f"{filename}. Chunk {chunk_number}.",
                )
            )

    return citations


# =====================================================
# Analytics
# =====================================================

def _build_analytics(
    db: Session,
    user: User,
    project_id: int,
):
    """
    Build report analytics.
    """

    analytics = get_analytics_overview(
        db=db,
        user=user,
    )

    statistics = analytics["statistics"]

    return ReportAnalytics(
        total_projects=statistics["projects"],
        total_documents=(
            db.query(Document)
            .filter(
                Document.user_id == user.id,
                Document.project_id == project_id,
            )
            .count()
        ),
        total_chat_sessions=(
            db.query(ChatSession)
            .filter(
                ChatSession.user_id == user.id,
                ChatSession.project_id == project_id,
            )
            .count()
        ),
        total_messages=_project_message_count(
            db,
            project_id,
        ),
        total_research_notes=(
            db.query(ResearchNote)
            .filter(
                ResearchNote.user_id == user.id,
                ResearchNote.project_id == project_id,
            )
            .count()
        ),
    )


# =====================================================
# AI Summary Placeholder
# =====================================================

def _empty_ai_summary():
    """
    Placeholder until Phase 29.2.
    """

    return ReportAISummary(
        executive_summary="",
        research_summary="",
        productivity_insights="",
    )


# =====================================================
# Build Report
# =====================================================

def build_research_report(
    db: Session,
    user: User,
    project_id: int,
):
    """
    Builds a complete research report object.
    """

    project = _get_project(
        db,
        user,
        project_id,
    )

    if project is None:
        return None

    documents = _get_documents(
        db,
        user,
        project_id,
    )

    chat_sessions = _get_chat_sessions(
        db,
        user,
        project_id,
    )

    research_notes = _get_research_notes(
        db,
        user,
        project_id,
    )
    report_documents = [
        ReportDocument(
            id=document.id,
            filename=document.original_filename,
            uploaded_at=document.uploaded_at,
        )
        for document in documents
    ]

    report_chat_sessions = [
        ReportChatSession(
            id=session.id,
            title=session.title,
            created_at=session.created_at,
            message_count=_message_count(
                db=db,
                session_id=session.id,
            ),
        )
        for session in chat_sessions
    ]

    report_notes = [
        ReportResearchNote(
            id=note.id,
            title=note.title,
            created_at=note.created_at,
            is_favorite=note.is_favorite,
            tags=note.tags or [],
        )
        for note in research_notes
    ]

    report = ResearchReportResponse(
        project=ReportProject(
            id=project.id,
            name=project.name,
            description=project.description,
            created_at=project.created_at,
        ),
        analytics=_build_analytics(
            db=db,
            user=user,
            project_id=project_id,
        ),
        documents=report_documents,
        chat_sessions=report_chat_sessions,
        research_notes=report_notes,
        citations=_collect_citations(
            db=db,
            project_id=project_id,
        ),
        ai_summary=generate_project_ai_summary(
            project=project,
            analytics=_build_analytics(
                db=db,
                user=user,
                project_id=project_id,
            ),
            documents=report_documents,
            chat_sessions=report_chat_sessions,
            research_notes=report_notes,
        ),
    )

    return report