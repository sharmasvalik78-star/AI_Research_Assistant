from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.session import get_db
from core.auth import get_current_user

from models.user import User
from models.chat_session import ChatSession
from models.project import Project

from schemas.chat_session import (
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    MessageResponse,
)

from services.chat_service import (
    create_chat_session,
    get_chat_sessions,
    get_chat_session,
    rename_chat_session,
    delete_chat_session,
)

from services.message_service import (
    get_session_messages,
)

router = APIRouter(
    prefix="/chat/sessions",
    tags=["Chat Sessions"],
)


@router.post("", response_model=ChatSessionResponse)
def create_session(
    request: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if request.project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == request.project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if project is None:
            raise HTTPException(
                status_code=404,
                detail="Project not found",
            )

    return create_chat_session(
        db=db,
        user=current_user,
        title=request.title,
        project_id=request.project_id,
    )


@router.get("", response_model=list[ChatSessionResponse])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_chat_sessions(
        db=db,
        user=current_user,
    )


@router.put("/{session_id}", response_model=ChatSessionResponse)
def update_session(
    session_id: int,
    request: ChatSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found",
        )

    return rename_chat_session(
        db=db,
        session=session,
        title=request.title,
    )


@router.delete("/{session_id}")
def remove_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found",
        )

    delete_chat_session(
        db=db,
        session=session,
    )

    return {
        "message": "Chat session deleted successfully"
    }


@router.get(
    "/{session_id}/messages",
    response_model=list[MessageResponse],
)
def list_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_chat_session(
        db=db,
        session_id=session_id,
        user=current_user,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found",
        )

    return get_session_messages(
        db=db,
        session=session,
    )