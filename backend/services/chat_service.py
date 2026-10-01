from typing import Optional

from sqlalchemy.orm import Session

from models.chat_session import ChatSession
from models.user import User


def create_chat_session(
    db: Session,
    user: User,
    title: str = "New Chat",
    project_id: Optional[int] = None,
) -> ChatSession:
    """
    Create a new chat session.

    If the title is longer than 60 characters,
    store only the first 60.
    """

    title = title.strip()

    if not title:
        title = "New Chat"

    if len(title) > 60:
        title = title[:60]

    session = ChatSession(
        title=title,
        user_id=user.id,
        project_id=project_id,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


# =====================================================
# GLOBAL RESEARCH CHAT
# =====================================================

def get_chat_sessions(
    db: Session,
    user: User,
):
    return (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == user.id,
            ChatSession.project_id.is_(None),
        )
        .order_by(ChatSession.updated_at.desc())
        .all()
    )


def get_chat_session(
    db: Session,
    session_id: int,
    user: User,
):
    return (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == user.id,
            ChatSession.project_id.is_(None),
        )
        .first()
    )


# =====================================================
# PROJECT CHAT
# =====================================================

def get_project_chat_sessions(
    db: Session,
    user: User,
    project_id: int,
):
    return (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == user.id,
            ChatSession.project_id == project_id,
        )
        .order_by(ChatSession.updated_at.desc())
        .all()
    )


def get_project_chat_session(
    db: Session,
    session_id: int,
    user: User,
    project_id: int,
):
    return (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == user.id,
            ChatSession.project_id == project_id,
        )
        .first()
    )


def rename_chat_session(
    db: Session,
    session: ChatSession,
    title: str,
) -> ChatSession:
    title = title.strip()

    if not title:
        return session

    if len(title) > 60:
        title = title[:60]

    session.title = title

    db.commit()
    db.refresh(session)

    return session


def delete_chat_session(
    db: Session,
    session: ChatSession,
):
    db.delete(session)
    db.commit()