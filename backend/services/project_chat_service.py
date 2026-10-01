from typing import List, Optional

from sqlalchemy.orm import Session

from models.document import Document
from models.project import Project
from models.user import User

from services.chat_service import (
    create_chat_session,
    get_project_chat_session,
    get_project_chat_sessions,
    rename_chat_session,
    delete_chat_session,
)
from services.message_service import (
    save_message,
    get_session_messages,
)
from services.rag_service import rag_service


def get_project(
    db: Session,
    project_id: int,
    user: User,
):
    """
    Return the project if it belongs to the user.
    """

    return (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == user.id,
        )
        .first()
    )


def get_project_documents(
    db: Session,
    project_id: int,
    user: User,
):
    """
    Return all documents that belong to a project.
    """

    return (
        db.query(Document)
        .filter(
            Document.user_id == user.id,
            Document.project_id == project_id,
        )
        .all()
    )


def list_project_chats(
    db: Session,
    project_id: int,
    user: User,
):
    return get_project_chat_sessions(
        db=db,
        user=user,
        project_id=project_id,
    )


def create_project_chat(
    db: Session,
    project_id: int,
    user: User,
    title: str = "New Chat",
):
    return create_chat_session(
        db=db,
        user=user,
        title=title,
        project_id=project_id,
    )


def rename_project_chat(
    db: Session,
    project_id: int,
    chat_id: int,
    title: str,
    user: User,
):
    session = get_project_chat_session(
        db=db,
        session_id=chat_id,
        user=user,
        project_id=project_id,
    )

    if not session:
        return None

    return rename_chat_session(
        db=db,
        session=session,
        title=title,
    )


def remove_project_chat(
    db: Session,
    project_id: int,
    chat_id: int,
    user: User,
):
    session = get_project_chat_session(
        db=db,
        session_id=chat_id,
        user=user,
        project_id=project_id,
    )

    if not session:
        return False

    delete_chat_session(
        db=db,
        session=session,
    )

    return True


def get_project_messages(
    db: Session,
    project_id: int,
    chat_id: int,
    user: User,
):
    session = get_project_chat_session(
        db=db,
        session_id=chat_id,
        user=user,
        project_id=project_id,
    )

    if not session:
        return None

    return get_session_messages(
        db=db,
        session=session,
    )


def ask_project_question(
    db: Session,
    project_id: int,
    chat_id: int,
    question: str,
    user: User,
    document_ids: Optional[List[int]] = None,
):
    """
    Ask AI using the selected project documents.
    Falls back to all project documents if none are selected.
    """

    session = get_project_chat_session(
        db=db,
        session_id=chat_id,
        user=user,
        project_id=project_id,
    )

    if not session:
        return None

    if not document_ids:
        documents = get_project_documents(
            db=db,
            project_id=project_id,
            user=user,
        )

        document_ids = [
            document.id
            for document in documents
        ]

    response = rag_service.ask(
        question=question,
        document_ids=document_ids,
    )

    save_message(
        db=db,
        session=session,
        role="user",
        content=question,
    )

    save_message(
        db=db,
        session=session,
        role="assistant",
        content=response["answer"],
        citations=response["context"],
    )

    return {
        "answer": response["answer"],
        "context": response["context"],
        "session_id": session.id,
    }