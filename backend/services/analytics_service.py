from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.project import Project
from models.document import Document
from models.chat_session import ChatSession
from models.research_note import ResearchNote
from models.message import Message
from services.analytics_helpers import generate_activity_analytics


MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]


def _monthly_counts(query_results):
    """
    Converts SQL month counts into a fixed 12-month dictionary.
    """

    values = {month: 0 for month in range(1, 13)}

    for month, count in query_results:
        if month:
            values[int(month)] = count

    return values


def _generate_monthly_analytics(
    project_counts,
    document_counts,
    chat_counts,
    note_counts,
):
    """
    Produces a fixed Jan-Dec analytics array.
    """

    monthly = []

    for month in range(1, 13):
        monthly.append(
            {
                "month": MONTHS[month - 1],
                "projects": project_counts.get(month, 0),
                "documents": document_counts.get(month, 0),
                "chats": chat_counts.get(month, 0),
                "notes": note_counts.get(month, 0),
            }
        )

    return monthly


def get_analytics_overview(db: Session, user, days=30):
    """
    Returns analytics overview for the authenticated user.
    """

    current_year = datetime.utcnow().year

    # ----------------------------
    # Statistics
    # ----------------------------

    total_projects = (
        db.query(Project)
        .filter(Project.user_id == user.id)
        .count()
    )

    total_documents = (
        db.query(Document)
        .filter(Document.user_id == user.id)
        .count()
    )

    total_chat_sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .count()
    )

    total_notes = (
        db.query(ResearchNote)
        .filter(ResearchNote.user_id == user.id)
        .count()
    )

    total_questions = (
        db.query(Message)
        .join(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .count()
    )

    # ----------------------------
    # Project Table
    # ----------------------------

    project_rows = []

    projects = (
        db.query(Project)
        .filter(Project.user_id == user.id)
        .all()
    )

    for project in projects:

        documents = (
            db.query(Document)
            .filter(Document.project_id == project.id)
            .count()
        )

        chats = (
            db.query(ChatSession)
            .filter(ChatSession.project_id == project.id)
            .count()
        )

        notes = (
            db.query(ResearchNote)
            .join(ChatSession)
            .filter(ChatSession.project_id == project.id)
            .count()
        )

        project_rows.append(
            {
                "name": project.name,
                "documents": documents,
                "chats": chats,
                "notes": notes,
                "activity": "Recently",
                "status": "Active",
            }
        )

    # ----------------------------
    # Monthly Analytics
    # ----------------------------

    project_months = (
        db.query(
            func.extract("month", Project.created_at),
            func.count(Project.id),
        )
        .filter(Project.user_id == user.id)
        .filter(
            func.extract("year", Project.created_at) == current_year
        )
        .group_by(func.extract("month", Project.created_at))
        .all()
    )

    document_months = (
        db.query(
            func.extract("month", Document.uploaded_at),
            func.count(Document.id),
        )
        .filter(Document.user_id == user.id)
        .filter(
            func.extract("year", Document.uploaded_at) == current_year
        )
        .group_by(func.extract("month", Document.uploaded_at))
        .all()
    )

    chat_months = (
        db.query(
            func.extract("month", ChatSession.created_at),
            func.count(ChatSession.id),
        )
        .filter(ChatSession.user_id == user.id)
        .filter(
            func.extract("year", ChatSession.created_at) == current_year
        )
        .group_by(func.extract("month", ChatSession.created_at))
        .all()
    )

    note_months = (
        db.query(
            func.extract("month", ResearchNote.created_at),
            func.count(ResearchNote.id),
        )
        .filter(ResearchNote.user_id == user.id)
        .filter(
            func.extract("year", ResearchNote.created_at) == current_year
        )
        .group_by(func.extract("month", ResearchNote.created_at))
        .all()
    )

    monthly_projects = _monthly_counts(project_months)
    monthly_documents = _monthly_counts(document_months)
    monthly_chats = _monthly_counts(chat_months)
    monthly_notes = _monthly_counts(note_months)

    charts = {
        "monthly": _generate_monthly_analytics(
            monthly_projects,
            monthly_documents,
            monthly_chats,
            monthly_notes,
        )
    }

    # ----------------------------
    # AI Usage
    # ----------------------------

    ai_usage = {
        "requests": total_questions,
        "tokens": total_questions * 750,
        "estimated_cost": round(
            (total_questions * 750 / 1_000_000) * 0.30,
            2,
        ),
        "success_rate": 100,
        "error_rate": 0,
    }

    # ----------------------------
    # Insights
    # ----------------------------

    insights = {
        "most_active_project": (
            project_rows[0]["name"]
            if project_rows
            else "No Projects"
        ),
        "documents": total_documents,
        "questions": total_questions,
        "notes": total_notes,
    }

    # ----------------------------
    # Activity Analytics
    # ----------------------------

    activity = generate_activity_analytics(
        db=db,
        user=user,
        days=days,
    )

    return {
        "statistics": {
            "projects": total_projects,
            "documents": total_documents,
            "chats": total_chat_sessions,
            "research_notes": total_notes,
            "ai_questions": total_questions,
            "average_response_time": 0,
        },
        "charts": charts,
        "projects": project_rows,
        "ai_usage": ai_usage,
        "insights": insights,
        "heatmap": activity["heatmap"],
        "current_streak": activity["current_streak"],
        "longest_streak": activity["longest_streak"],
        "most_active_day": activity["most_active_day"],
        "activity_summary": activity["activity_summary"],
    }