from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.user import User
from models.document import Document
from models.chat_session import ChatSession
from models.research_note import ResearchNote

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .count()
    )

    chats = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .count()
    )

    notes = (
        db.query(ResearchNote)
        .filter(ResearchNote.user_id == current_user.id)
        .count()
    )

    favorites = (
        db.query(ResearchNote)
        .filter(
            ResearchNote.user_id == current_user.id,
            ResearchNote.is_favorite == True,
        )
        .count()
    )

    recent_documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .limit(5)
        .all()
    )

    recent_notes = (
        db.query(ResearchNote)
        .filter(ResearchNote.user_id == current_user.id)
        .order_by(ResearchNote.created_at.desc())
        .limit(5)
        .all()
    )

    recent_chats = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .limit(5)
        .all()
    )

    recent_activity = []

    for document in recent_documents:
        recent_activity.append(
            {
                "type": "document",
                "title": document.original_filename,
                "timestamp": document.uploaded_at,
            }
        )

    for note in recent_notes:
        recent_activity.append(
            {
                "type": "note",
                "title": note.title,
                "timestamp": note.created_at,
            }
        )

    for chat in recent_chats:
        recent_activity.append(
            {
                "type": "chat",
                "title": chat.title,
                "timestamp": chat.updated_at,
            }
        )

    recent_activity.sort(
        key=lambda activity: activity["timestamp"],
        reverse=True,
    )

    recent_activity = recent_activity[:10]

    return {
        "stats": {
            "documents": documents,
            "chats": chats,
            "notes": notes,
            "favorites": favorites,
        },
        "recent_activity": recent_activity,
    }